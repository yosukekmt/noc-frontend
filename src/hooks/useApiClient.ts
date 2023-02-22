//import Axios from "axios";
import { useCallback } from "react";

const ERROR_MESSAGES = [
  { code: 400, message: "Client Error(400): bad_request" },
  { code: 401, message: "Client Error(401): unauthorized" },
  { code: 402, message: "Client Error(402): payment_required" },
  { code: 403, message: "Client Error(403): forbidden" },
  { code: 404, message: "Client Error(404): not_found" },
  { code: 405, message: "Client Error(405): method_not_allowed" },
  { code: 406, message: "Client Error(406): not_acceptable" },
  { code: 407, message: "Client Error(407): proxy_authentication_required" },
  { code: 408, message: "Client Error(408): request_timeout" },
  { code: 409, message: "Client Error(409): conflict" },
  { code: 410, message: "Client Error(410): gone" },
  { code: 411, message: "Client Error(411): length_required" },
  { code: 412, message: "Client Error(412): precondition_failed" },
  { code: 413, message: "Client Error(413): request_entity_too_large" },
  { code: 414, message: "Client Error(414): request_uri_too_long" },
  { code: 415, message: "Client Error(415): unsupported_media_type" },
  { code: 416, message: "Client Error(416): requested_range_not_satisfiable" },
  { code: 417, message: "Client Error(417): expectation_failed" },
  { code: 422, message: "Client Error(422): unprocessable_entity" },
  { code: 423, message: "Client Error(423): locked" },
  { code: 424, message: "Client Error(424): failed_dependency" },
  { code: 426, message: "Client Error(426): upgrade_required" },
  { code: 500, message: "Server Error(500): :internal_server_error" },
  { code: 501, message: "Server Error(501): :not_implemented" },
  { code: 502, message: "Server Error(502): :bad_gateway" },
  { code: 503, message: "Server Error(503): :service_unavailable" },
  { code: 504, message: "Server Error(504): :gateway_timeout" },
  { code: 505, message: "Server Error(505): :http_version_not_supported" },
  { code: 507, message: "Server Error(507): :insufficient_storage" },
  { code: 510, message: "Server Error(510): :not_extended" },
];

/*
const apiClient = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});
*/

const apiClient: any = [];

export const useApiClient = () => {
  const getErrorMessage = useCallback((err: unknown): string | null => {
    const resp = (err as any).response;
    if (!resp) {
      return null;
    }
    return (
      ERROR_MESSAGES.find((message) => message.code === resp.status)?.message ||
      null
    );
  }, []);

  const isBadRequestError = useCallback((err: unknown): boolean => {
    const resp = (err as any).response;
    if (!resp) {
      return false;
    }
    return resp.status === 400;
  }, []);

  const isUnauthorizedError = useCallback((err: unknown): boolean => {
    const resp = (err as any).response;
    if (!resp) {
      return false;
    }
    return resp.status === 401;
  }, []);

  return {
    apiClient,
    getErrorMessage,
    isBadRequestError,
    isUnauthorizedError,
  };
};
