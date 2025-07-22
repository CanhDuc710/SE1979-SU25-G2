package org.example.se1979su25g2be.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class VNPayConfig {

    public static final String VNP_PAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static final String VNP_RETURN_URL = "http://localhost:3000/order/vnpay-return";
    public static final String VNP_TMN_CODE = "8CWAWKX6";
    public static final String VNP_HASH_SECRET = "VHUKLWGJCKPWW44VWLSMX2M967A2DVSR";
    public static final String VNP_API_URL = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";
    public static final String VNP_VERSION = "2.1.0";
    public static final String VNP_COMMAND = "pay";
    public static final String VNP_ORDER_TYPE = "other";
    public static final String VNP_CURRENCY_CODE = "VND";
    public static final String VNP_LOCALE = "vn";
}
