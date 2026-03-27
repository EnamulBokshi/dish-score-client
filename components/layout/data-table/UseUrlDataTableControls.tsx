"use client";

import { PaginationState, SortingState } from "@tanstack/react-table";
import { useEffect, useMemo, useState, useTransition } from "react";

interface QueryParamsObject {
  [key: string]: string | string[] | undefined;
}

interface UseUrlDataTableControlsParams {
  queryParamsObject: QueryParamsObject;
  searchParams: { toString: () => string };
  pathname: string;
  router: { push: (href: string) => void };
  serverPage?: number;
  serverLimit?: number;
  defaultPageSize?: number;
}

const pickFirst = (value: string | string[] | undefined) => {
  return Array.isArray(value) ? value[0] : value;
};

export default function useUrlDataTableControls({
  queryParamsObject,
  searchParams,
  pathname,
  router,
  serverPage,
  serverLimit,
  defaultPageSize = 10,
}: UseUrlDataTableControlsParams) {
  const [isNavigationPending, startTransition] = useTransition();
  const [optimisticSorting, setOptimisticSorting] =
    useState<SortingState | null>(null);
  const [optimisticPagination, setOptimisticPagination] =
    useState<PaginationState | null>(null);
  const [optimisticSearchTerm, setOptimisticSearchTerm] =
    useState<string | null>(null);

  const sortingState: SortingState = useMemo(() => {
    const sortBy = pickFirst(queryParamsObject.sortBy);
    const sortOrder = pickFirst(queryParamsObject.sortOrder);

    if (!sortBy) {
      return [];
    }

    return [
      {
        id: sortBy,
        desc: String(sortOrder).toLowerCase() === "desc",
      },
    ];
  }, [queryParamsObject]);

  const paginationState: PaginationState = useMemo(() => {
    const page = Number(pickFirst(queryParamsObject.page)) || serverPage || 1;
    const limit =
      Number(pickFirst(queryParamsObject.limit)) || serverLimit || defaultPageSize;

    return {
      pageIndex: Math.max(page - 1, 0),
      pageSize: Math.max(limit, 1),
    };
  }, [defaultPageSize, queryParamsObject, serverLimit, serverPage]);

  const searchTermState = useMemo(() => {
    return String(pickFirst(queryParamsObject.searchTerm) ?? "");
  }, [queryParamsObject]);

  useEffect(() => {
    setOptimisticSorting(null);
  }, [sortingState]);

  useEffect(() => {
    setOptimisticPagination(null);
  }, [paginationState]);

  useEffect(() => {
    setOptimisticSearchTerm(null);
  }, [searchTermState]);

  const pushParams = (params: URLSearchParams) => {
    const nextQuery = params.toString();
    startTransition(() => {
      router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    });
  };

  const resetPaginationToFirstPage = () => {
    setOptimisticPagination((prev) => ({
      pageIndex: 0,
      pageSize: prev?.pageSize ?? paginationState.pageSize,
    }));
  };

  const handleSortingChange = (state: SortingState) => {
    setOptimisticSorting(state);
    resetPaginationToFirstPage();

    const params = new URLSearchParams(searchParams.toString());
    const nextSort = state[0];

    if (!nextSort) {
      params.delete("sortBy");
      params.delete("sortOrder");
    } else {
      params.set("sortBy", nextSort.id);
      params.set("sortOrder", nextSort.desc ? "desc" : "asc");
    }

    params.set("page", "1");
    params.set("limit", String(paginationState.pageSize));

    pushParams(params);
  };

  const handlePaginationChange = (state: PaginationState) => {
    setOptimisticPagination(state);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(state.pageIndex + 1));
    params.set("limit", String(state.pageSize));

    pushParams(params);
  };

  const handleSearchChange = (searchTerm: string) => {
    setOptimisticSearchTerm(searchTerm);
    resetPaginationToFirstPage();

    const params = new URLSearchParams(searchParams.toString());
    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm) {
      params.set("searchTerm", trimmedSearchTerm);
    } else {
      params.delete("searchTerm");
    }

    params.set("page", "1");
    params.set("limit", String(paginationState.pageSize));

    pushParams(params);
  };

  return {
    isNavigationPending,
    sortingState,
    paginationState,
    searchTermState,
    optimisticSorting,
    optimisticPagination,
    optimisticSearchTerm,
    setOptimisticPagination,
    handleSortingChange,
    handlePaginationChange,
    handleSearchChange,
  };
}
