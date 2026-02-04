/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DsLang {
  description?: string;
  family?: string;
  id?: number;
  imageURL?: string;
  lexicon?: string[];
  name?: string;
  /** для удаления языка */
  status?: string;
  subgroup?: string;
  videoURL?: string;
  writingFamily?: string;
}

export interface DsLangCalculation {
  baseLanguageID?: number;
  dateCreate?: string;
  dateFinish?: string;
  dateUpdate?: string;
  id?: number;
  languages?: DsLangCalculationLanguage[];
  linguistID?: number;
  researcherID?: number;
  resultYearsAgo?: number;
  similarityRate?: number;
  status?: string;
}

export interface DsLangCalculationLanguage {
  id?: number;
  isBase?: boolean;
  langCalculationID?: number;
  language?: DsLang;
  languageID?: number;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Language Annotation Backend API
 * @version 1.0
 * @contact
 *
 * Расчет времени расхождения языков методом глоттохронологии.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Вход в систему по логину и паролю. Возвращает JWT-токен и устанавливает сессионную куку.
     *
     * @tags Аутентификация
     * @name AuthLoginCreate
     * @summary Аутентификация пользователя
     * @request POST:/api/auth/login
     */
    authLoginCreate: (
      credentials: {
        login?: string;
        password?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          " jwt"?: string;
          " user"?: {
            " is_linguist"?: boolean;
            " login"?: string;
            id?: number;
          };
          message?: string;
        },
        object
      >({
        path: `/api/auth/login`,
        method: "POST",
        body: credentials,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Получает список заявок. Гость: 401. Создатель: только свои заявки. Модератор: все заявки.
     *
     * @tags Заявки (LangCalculation)
     * @name LangCalculationList
     * @summary Получить список заявок
     * @request GET:/api/lang-calculation
     * @secure
     */
    langCalculationList: (
      query?: {
        /** Фильтр по статусу заявки (для модератора) */
        status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsLangCalculation[], object>({
        path: `/api/lang-calculation`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает ID черновика и количество языков в нем для текущего пользователя.
     *
     * @tags Заявки (LangCalculation)
     * @name LangCalculationCartList
     * @summary Получить статус черновика/корзины
     * @request GET:/api/lang-calculation/cart
     */
    langCalculationCartList: (params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/api/lang-calculation/cart`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает количество языков в текущем черновике пользователя. Требуется авторизация.
     *
     * @tags Заявки (LangCalculation)
     * @name LangCalculationDraftCountList
     * @summary Получить количество языков в черновике (корзине)
     * @request GET:/api/lang-calculation/draft/count
     * @secure
     */
    langCalculationDraftCountList: (params: RequestParams = {}) =>
      this.request<
        {
          count?: number;
        },
        void
      >({
        path: `/api/lang-calculation/draft/count`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Устанавливает один из языков в черновике как базовый. Доступно только для создателя.
     *
     * @tags Заявки (LangCalculation)
     * @name LangCalculationBaseUpdate
     * @summary Назначить базовый язык для заявки
     * @request PUT:/api/lang-calculation/{calculation_id}/base/{language_id}
     * @secure
     */
    langCalculationBaseUpdate: (
      calculationId: number,
      languageId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/lang-calculation/${calculationId}/base/${languageId}`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * @description Возвращает детальную информацию о заявке. Требуется авторизация.
     *
     * @tags Заявки (LangCalculation)
     * @name LangCalculationDetail
     * @summary Получить заявку по ID
     * @request GET:/api/lang-calculation/{id}
     * @secure
     */
    langCalculationDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsLangCalculation, object>({
        path: `/api/lang-calculation/${id}`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновление несистемных полей заявки. Требуется авторизация (Создатель или Модератор).
     *
     * @tags Заявки (LangCalculation)
     * @name LangCalculationUpdate
     * @summary Обновить поля заявки
     * @request PUT:/api/lang-calculation/{id}
     * @secure
     */
    langCalculationUpdate: (
      id: number,
      updates: Record<string, any>,
      params: RequestParams = {},
    ) =>
      this.request<DsLangCalculation, void>({
        path: `/api/lang-calculation/${id}`,
        method: "PUT",
        body: updates,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Логически удаляет заявку. Требуется авторизация.
     *
     * @tags Заявки (LangCalculation)
     * @name LangCalculationDelete
     * @summary Удалить заявку (логическое удаление)
     * @request DELETE:/api/lang-calculation/{id}
     * @secure
     */
    langCalculationDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/lang-calculation/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Обновляет статус заявки на 'завершён' или 'отклонён'. Доступно только для Модератора/Лингвиста. При завершении, производит расчет.
     *
     * @tags Заявки (LangCalculation)
     * @name LangCalculationCompleteUpdate
     * @summary Завершить или отклонить заявку (для Модератора)
     * @request PUT:/api/lang-calculation/{id}/complete
     * @secure
     */
    langCalculationCompleteUpdate: (
      id: number,
      action: {
        action?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, object>({
        path: `/api/lang-calculation/${id}/complete`,
        method: "PUT",
        body: action,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Изменяет статус черновика на 'сформирован', устанавливает дату формирования. Проверяет, что заявка не пуста.
     *
     * @tags Заявки (LangCalculation)
     * @name LangCalculationFormUpdate
     * @summary Сформировать (отправить) заявку
     * @request PUT:/api/lang-calculation/{id}/form
     * @secure
     */
    langCalculationFormUpdate: (id: number, params: RequestParams = {}) =>
      this.request<
        void,
        {
          error?: string;
        } | void
      >({
        path: `/api/lang-calculation/${id}/form`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * @description Изменение параметров добавленного языка в заявке (заглушка в реализации). Требуется авторизация.
     *
     * @tags Заявки (LangCalculation)
     * @name LangCalculationLangsUpdate
     * @summary Обновить параметры языка в заявке
     * @request PUT:/api/lang-calculation/{id}/langs
     * @secure
     */
    langCalculationLangsUpdate: (
      id: number,
      updates: Record<string, any>,
      params: RequestParams = {},
    ) =>
      this.request<object, void>({
        path: `/api/lang-calculation/${id}/langs`,
        method: "PUT",
        body: updates,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет язык в текущий черновик пользователя. Если черновика нет, он создается. Требуется авторизация.
     *
     * @tags Заявки (LangCalculation)
     * @name LangCalculationLangsCreate
     * @summary Добавить язык в черновик (корзину)
     * @request POST:/api/lang-calculation/{id}/langs
     * @secure
     */
    langCalculationLangsCreate: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/lang-calculation/${id}/langs`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Удаляет язык из конкретной заявки. Требуется авторизация.
     *
     * @tags Заявки (LangCalculation)
     * @name LangCalculationLangsDelete
     * @summary Удалить язык из заявки
     * @request DELETE:/api/lang-calculation/{id}/langs
     * @secure
     */
    langCalculationLangsDelete: (
      id: number,
      query: {
        /** ID языка, который нужно удалить */
        language_id: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/lang-calculation/${id}/langs`,
        method: "DELETE",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Создает новый язык, принимая текстовые данные, картинку и видео в одном multipart/form-data запросе.
     *
     * @tags Языки
     * @name LangsCreate
     * @summary Создать новый язык (с картинкой и видео)
     * @request POST:/api/langs
     * @secure
     */
    langsCreate: (
      data: {
        /** Название языка */
        name: string;
        /** Семья языка */
        family: string;
        /** Подгруппа языка */
        subgroup?: string;
        /** Письменность */
        writingFamily?: string;
        /** Описание языка */
        description: string;
        /** JSON-строка списка Сводеша. Пример: [\ */
        lexicon: string;
        /**
         * Файл картинки
         * @format binary
         */
        image: File;
        /**
         * Файл видео
         * @format binary
         */
        video: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        DsLang,
        {
          error?: string;
        }
      >({
        path: `/api/langs`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает список языков, опционально фильтрованных по запросу.
     *
     * @tags Languages
     * @name LanguagesList
     * @summary Получить список языков
     * @request GET:/api/languages
     */
    languagesList: (
      query?: {
        /** Поисковый запрос для фильтрации по имени */
        query?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsLang[], object>({
        path: `/api/languages`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает полную информацию о языке.
     *
     * @tags Languages
     * @name LanguagesDetail
     * @summary Получить язык по ID
     * @request GET:/api/languages/{id}
     */
    languagesDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsLang, object>({
        path: `/api/languages/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Доступно только для Модератора/Лингвиста.
     *
     * @tags Languages
     * @name LanguagesUpdate
     * @summary Обновить информацию о языке
     * @request PUT:/api/languages/{id}
     * @secure
     */
    languagesUpdate: (
      id: number,
      updates: Record<string, any>,
      params: RequestParams = {},
    ) =>
      this.request<DsLang, object>({
        path: `/api/languages/${id}`,
        method: "PUT",
        body: updates,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Устанавливает статус языка как 'удалён'. Доступно только для Модератора/Лингвиста.
     *
     * @tags Languages
     * @name LanguagesDelete
     * @summary Логически удалить (скрыть) язык
     * @request DELETE:/api/languages/{id}
     * @secure
     */
    languagesDelete: (id: number, params: RequestParams = {}) =>
      this.request<object, object>({
        path: `/api/languages/${id}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Загрузка файла изображения. Использует multipart/form-data с полем "file". Доступно только для Модератора/Лингвиста.
     *
     * @tags Languages
     * @name LanguagesImageCreate
     * @summary Загрузить изображение для языка
     * @request POST:/api/languages/{id}/image
     * @secure
     */
    languagesImageCreate: (
      id: number,
      data: {
        /** Файл изображения */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, object>({
        path: `/api/languages/${id}/image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  auth = {
    /**
     * @description Удаляет сессию пользователя и очищает cookie.
     *
     * @tags Аутентификация
     * @name LogoutCreate
     * @summary Выход из системы
     * @request POST:/auth/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<object, any>({
        path: `/auth/logout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  languages = {
    /**
     * @description Принимает данные лексикона в формате CSV из HTML-формы и сохраняет.
     *
     * @tags Languages
     * @name LexiconCreate
     * @summary Обновить лексикон языка (через форму)
     * @request POST:/languages/{id}/lexicon
     */
    lexiconCreate: (
      id: number,
      data: {
        /** Лексикон в формате CSV */
        lexicon_csv: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, void>({
        path: `/languages/${id}/lexicon`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),
  };
  users = {
    /**
     * @description Создает нового пользователя с логином и паролем.
     *
     * @tags Аутентификация
     * @name RegisterCreate
     * @summary Регистрация нового пользователя
     * @request POST:/users/register
     */
    registerCreate: (
      user_credentials: {
        login?: string;
        password?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<object, object>({
        path: `/users/register`,
        method: "POST",
        body: user_credentials,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
