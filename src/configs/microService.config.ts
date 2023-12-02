import { ServiceResponseInterface } from "@/types/ServiceResponse.Interface";
import { HTTP_STATUS_CODES } from "./httpStatusCodes.config";

export const defaultServiceResponseInterfaceValue : ServiceResponseInterface = {
    data:{},
    status:HTTP_STATUS_CODES.HTTP_500_INTERNAL_SERVER_ERROR
}