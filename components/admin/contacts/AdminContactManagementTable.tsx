"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ErrorState } from "@/components/common/ErrorState";
import DataTableFilterPopover from "@/components/layout/data-table/DataTableFilterPopOver";
import useUrlDataTableControls from "@/components/layout/data-table/UseUrlDataTableControls";
import DataTable from "@/components/layout/data-show/DataTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteContact,
  getContacts,
  replyContact,
  updateContactStatus,
} from "@/services/contact-us.services";
import { ContactMessageStatus, IContactMessage } from "@/types/contact.types";
import {
  replyContactZodSchema,
  updateContactStatusZodSchema,
} from "@/zod/contact.schema";

import { contactColumns } from "./contactColumns";

interface QueryParamsObject {
  [key: string]: string | string[] | undefined;
}

interface AdminContactManagementTableProps {
  queryString: string;
  queryParamsObject: QueryParamsObject;
}

interface ContactFilterDraft {
  status: string;
  email: string;
}

const getFirst = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

function getApiErrorMessage(error: unknown, fallback: string) {
  const maybeError = error as {
    response?: { data?: { message?: string; error?: string } };
    message?: string;
  };

  return (
    maybeError?.response?.data?.message ||
    maybeError?.response?.data?.error ||
    maybeError?.message ||
    fallback
  );
}

export default function AdminContactManagementTable({
  queryString,
  queryParamsObject,
}: AdminContactManagementTableProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedContactForReply, setSelectedContactForReply] = useState<IContactMessage | null>(null);
  const [selectedContactForEdit, setSelectedContactForEdit] = useState<IContactMessage | null>(null);
  const [selectedContactForDelete, setSelectedContactForDelete] = useState<IContactMessage | null>(null);
  const [replyFormState, setReplyFormState] = useState({
    subject: "",
    message: "",
  });
  const [selectedStatus, setSelectedStatus] = useState<ContactMessageStatus>("PENDING");

  const [draftFilters, setDraftFilters] = useState<ContactFilterDraft>({
    status: String(getFirst(queryParamsObject.status) ?? "all"),
    email: String(getFirst(queryParamsObject.email) ?? ""),
  });

  const {
    isNavigationPending,
    sortingState,
    paginationState,
    searchTermState,
    optimisticSorting,
    optimisticPagination,
    optimisticSearchTerm,
    handleSortingChange,
    handlePaginationChange,
    handleSearchChange,
  } = useUrlDataTableControls({
    queryParamsObject,
    searchParams,
    pathname,
    router,
    defaultPageSize: 10,
  });

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["admin-contacts", queryString],
    queryFn: () => getContacts(queryString),
    placeholderData: (previousData) => previousData,
  });

  const { mutateAsync: replyContactMutation, isPending: isReplying } = useMutation({
    mutationFn: ({ contactId, subject, message }: { contactId: string; subject: string; message: string }) =>
      replyContact(contactId, { subject, message }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
      toast.success("Reply sent successfully");
      setSelectedContactForReply(null);
      setReplyFormState({ subject: "", message: "" });
    },
  });

  const { mutateAsync: updateContactStatusMutation, isPending: isUpdatingStatus } = useMutation({
    mutationFn: ({ contactId, status }: { contactId: string; status: ContactMessageStatus }) =>
      updateContactStatus(contactId, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
      toast.success("Contact status updated successfully");
      setSelectedContactForEdit(null);
    },
  });

  const { mutateAsync: deleteContactMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteContact,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
      toast.success("Contact deleted successfully");
      setSelectedContactForDelete(null);
    },
  });

  const contacts = data?.data ?? [];
  const totalItems = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  const activeSortingState = optimisticSorting ?? sortingState;
  const activePaginationState = optimisticPagination ?? paginationState;
  const activeSearchTerm = optimisticSearchTerm ?? searchTermState;
  const showLoadingState = isLoading || isFetching || isNavigationPending;

  const activeFilterCount =
    (getFirst(queryParamsObject.status) ? 1 : 0) +
    (getFirst(queryParamsObject.email) ? 1 : 0);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (draftFilters.status && draftFilters.status !== "all") {
      params.set("status", draftFilters.status);
    } else {
      params.delete("status");
    }

    if (draftFilters.email.trim()) {
      params.set("email", draftFilters.email.trim());
    } else {
      params.delete("email");
    }

    params.set("page", "1");
    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const handleClearFilters = () => {
    setDraftFilters({ status: "all", email: "" });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("status");
    params.delete("email");
    params.set("page", "1");

    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const handleReplySubmit = async () => {
    if (!selectedContactForReply) {
      return;
    }

    const parsed = replyContactZodSchema.safeParse({
      subject: replyFormState.subject,
      message: replyFormState.message,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid reply payload");
      return;
    }

    try {
      await replyContactMutation({
        contactId: selectedContactForReply.id,
        subject: parsed.data.subject,
        message: parsed.data.message,
      });
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError, "Failed to send reply"));
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedContactForEdit) {
      return;
    }

    const parsed = updateContactStatusZodSchema.safeParse({
      status: selectedStatus,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid status");
      return;
    }

    try {
      await updateContactStatusMutation({
        contactId: selectedContactForEdit.id,
        status: parsed.data.status,
      });
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError, "Failed to update contact status"));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedContactForDelete) {
      return;
    }

    try {
      await deleteContactMutation(selectedContactForDelete.id);
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError, "Failed to delete contact"));
    }
  };

  const actionLabels = useMemo(
    () => ({
      view: "Reply",
      edit: "Edit",
      delete: "Delete",
    }),
    [],
  );

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contact Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState
            title="Failed to load contact requests"
            description="Please retry or refresh the page."
            error={error instanceof Error ? error : undefined}
            retry={() => {
              void refetch();
            }}
            variant="card"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataTable<IContactMessage>
          data={contacts}
          columns={contactColumns}
          isLoading={showLoadingState}
          emptyMessage="No contact requests found for this query."
          search={{
            value: activeSearchTerm,
            onSearchChange: handleSearchChange,
            placeholder: "Search by id, name, email, subject, message...",
            debounceMs: 500,
          }}
          filters={
            <DataTableFilterPopover
              activeCount={activeFilterCount}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              title="Filter contact requests"
              description="Filter by status and exact requester email."
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <Select
                    value={draftFilters.status}
                    onValueChange={(value) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        status: value,
                      }))
                    }
                  >
                    <SelectTrigger size="sm">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="PENDING">PENDING</SelectItem>
                      <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                      <SelectItem value="RESOLVED">RESOLVED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Email</p>
                  <Input
                    value={draftFilters.email}
                    onChange={(event) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    placeholder="Filter by requester email"
                  />
                </div>
              </div>
            </DataTableFilterPopover>
          }
          pagination={{
            state: activePaginationState,
            pageCount: totalPages,
            totalItems,
            onPaginationChange: handlePaginationChange,
          }}
          sorting={{
            state: activeSortingState,
            onSortingChange: handleSortingChange,
          }}
          actions={{
            onView: (contact) => {
              setReplyFormState({
                subject: `Regarding your request: ${contact.subject}`,
                message: "",
              });
              setSelectedContactForReply(contact);
            },
            onEdit: (contact) => {
              setSelectedStatus(contact.status);
              setSelectedContactForEdit(contact);
            },
            onDelete: (contact) => setSelectedContactForDelete(contact),
            labels: actionLabels,
          }}
        />

        <Dialog
          open={Boolean(selectedContactForReply)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedContactForReply(null);
              setReplyFormState({ subject: "", message: "" });
            }
          }}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Reply Contact Request</DialogTitle>
              <DialogDescription>
                Send a direct response to {selectedContactForReply?.name || "this user"}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Subject</p>
                <Input
                  value={replyFormState.subject}
                  onChange={(event) =>
                    setReplyFormState((prev) => ({
                      ...prev,
                      subject: event.target.value,
                    }))
                  }
                  placeholder="Reply subject"
                />
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-medium">Message</p>
                <Textarea
                  rows={7}
                  value={replyFormState.message}
                  onChange={(event) =>
                    setReplyFormState((prev) => ({
                      ...prev,
                      message: event.target.value,
                    }))
                  }
                  placeholder="Write your reply..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedContactForReply(null);
                  setReplyFormState({ subject: "", message: "" });
                }}
                disabled={isReplying}
              >
                Cancel
              </Button>
              <Button onClick={() => void handleReplySubmit()} disabled={isReplying}>
                {isReplying ? "Sending..." : "Send Reply"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={Boolean(selectedContactForEdit)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedContactForEdit(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Contact Status</DialogTitle>
              <DialogDescription>
                Update the request status for {selectedContactForEdit?.name || "this contact"}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-1.5">
              <p className="text-sm font-medium">Status</p>
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as ContactMessageStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                  <SelectItem value="RESOLVED">RESOLVED</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedContactForEdit(null)}
                disabled={isUpdatingStatus}
              >
                Cancel
              </Button>
              <Button onClick={() => void handleStatusUpdate()} disabled={isUpdatingStatus}>
                {isUpdatingStatus ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={Boolean(selectedContactForDelete)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Contact Request</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the selected contact request. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedContactForDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => void handleDeleteConfirm()}
                disabled={isDeleting}
                variant="destructive"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
