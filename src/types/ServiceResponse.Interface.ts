import { HTTP_STATUS_CODES } from "@/configs/httpStatusCodes.config";

export interface ServiceResponseInterface {
    status:HTTP_STATUS_CODES;
    data:any;
}

