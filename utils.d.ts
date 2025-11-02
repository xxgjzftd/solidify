import 'solid-js'
import 'class-variance-authority'

import './api'

import colors from 'tailwindcss/colors'

declare global {
  export type { components, paths } from './api'
  export type { VariantProps } from 'class-variance-authority'
  export type {
    Accessor,
    Component,
    JSX,
    ParentProps,
    Setter,
    Signal,
    VoidProps,
  } from 'solid-js'

  export type AreaDto = components['schemas']['AreaDto']
  export type AreAllPropertiesOptional<
    T,
    U = { [K in keyof T]-?: undefined extends T[K] ? true : false },
  > = U[keyof U] extends true ? true : false
  export type Colors = keyof typeof colors
  export type CommitDto = components['schemas']['CommitDto']
  export type ConvertQueryList<T> = {
    [K in keyof T]: T[K] extends (infer E)[] | undefined ? E | T[K] : T[K]
  }

  export type ConvertQueryLookup<T> = {
    [K in keyof T]: T[K] extends LookupDto | undefined
      ? string
      : T[K] extends LookupDto[] | undefined
        ? string[] | undefined
        : T[K]
  }

  export type CouldBeArray<T> = T | T[]

  export type EmptyRecordToNever<T> = IfEmptyRecord<T, never, T>

  export interface ExposeProps<T> {
    expose?: (e: Readonly<T>) => void
  }

  export type HttpMethod = 'delete' | 'get' | 'post' | 'put'

  export type IfEmptyRecord<T, Y = true, N = false> = keyof T extends never
    ? Y
    : N

  export type IfNever<T, Y = true, N = false> = [T] extends [never] ? Y : N

  export type LiteralString<T> = T extends string
    ? string extends T
      ? string
      : T
    : string

  export type LookupDto = components['schemas']['LookupDto']

  export type NonNeverKeys<T> = {
    [K in keyof T]: T[K] extends never ? never : K
  }[keyof T]

  export type NonOptionalKeys<T> = {
    [K in keyof T]-?: undefined extends T[K] ? never : K
  }[keyof T]

  export type Override<T, U> = Omit<T, keyof U> & U

  export type PagingResultDto = components['schemas']['PagingResultDto']

  export type PartialArrayProperties<
    T,
    P = { [K in keyof T]-?: T[K] extends unknown[] ? K : never }[keyof T],
  > = Omit<T, P> & Partial<Pick<T, P>>

  export interface ResolveAjaxInitData<RD> {
    data?: CouldBeArray<RD>
  }

  export type ResolveAjaxInitFromOperation<T> = ResolveAjaxInitData<
    ResolveResponseDataFromOperation<T>
  > &
    ResolveRequestFromOperation<T>

  export type ResolveArrayElement<T> = T extends (infer E)[] ? E : T

  export type ResolveDataFromResponse<T> = T extends { data: (infer Data)[] }
    ? Data
    : never

  export type ResolvePagingFromOperation<T> = ResolvePagingFromResponse<
    ResolveResponseFromOperation<T>
  >

  export type ResolvePagingFromResponse<T> = T extends {
    meta: { paging: infer Paging }
  }
    ? Paging
    : never

  export type ResolvePathFromOperation<T> = T extends {
    parameters: { path: infer Path }
  }
    ? Path
    : never

  export type ResolvePayloadDataFromOperation<T> = T extends {
    requestBody: { content: { 'application/json': { data: (infer Data)[] } } }
  }
    ? PartialArrayProperties<Data>
    : T extends {
          requestBody: { content: { '*/*': { data: (infer Data)[] } } }
        }
      ? PartialArrayProperties<Data>
      : never

  export type ResolveQueryFromOperation<T> = ConvertQueryList<
    ConvertQueryLookup<
      T extends { parameters: { query: { request: infer RequestParameters } } }
        ? Partial<RequestParameters>
        : T extends { parameters: { query?: infer Query } }
          ? Query
          : never
    >
  >

  export type ResolveRequestFromOperation<T> = ResolveRequestPath<
    ResolvePathFromOperation<T>
  > &
    ResolveRequestPayload<ResolvePayloadDataFromOperation<T>> &
    ResolveRequestQuery<ResolveQueryFromOperation<T>>

  export type ResolveRequestPath<PT> = IfNever<PT, object, { path: PT }>

  export type ResolveRequestPayload<PD> = IfNever<
    PD,
    object,
    { payload: CouldBeArray<PD> }
  >

  export type ResolveRequestQuery<QR> = IfNever<
    QR,
    object,
    AreAllPropertiesOptional<QR> extends true ? { query?: QR } : { query: QR }
  >

  export type ResolveResponseDataFromOperation<T> = ResolveDataFromResponse<
    ResolveResponseFromOperation<T>
  >
  export type ResolveResponseFromOperation<T> = T extends {
    responses: { 200: { content: { '*/*': infer Response } } }
  }
    ? Response
    : never
  export type SetRequired<T, K extends keyof T> = Omit<T, K> &
    Required<Pick<T, K>>
  export interface UIProps<T> {
    ui?: T
  }
  export type UrlCouldFetchWith<
    M extends HttpMethod,
    T = { [K in keyof paths]: paths[K] extends Record<M, unknown> ? K : never },
  > = T[keyof T]

  export type UrlCouldGet = UrlCouldFetchWith<'get'>
}

export {}
