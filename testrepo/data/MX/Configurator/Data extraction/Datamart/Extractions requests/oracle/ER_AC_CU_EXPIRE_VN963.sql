select DATA_DT,
       ENTITY,
       BU,
       E_I,
       TRN_PRODUCT,
       M_TRN_TYPE,
       TRADE_CATEGORY,
       M_TP_ACCSCT,
       CNT_NB,
       CNT_VERSION,
       TRN_NB,
       ORIGIN_NB,
       CREATOR_NB,
       PORTFOLIO_CODE,
       ACTUATE_DATE,
       TRADE_DATE,
       EXPIRE_DATE,
       FIXING_DATE,
       B_S,
       C_P,
       CUR_1,
       CONTRACT_AMOUNT,
       COUNTER_RATE,
       CUR_2,
       COUNTER_AMOUNT,
       COUNTERPARTY_CODE,
       BANK_CUSTOMER,
       LOCALE,
       HOME_COUNTRY,
       BRANCH_CODE,
       PREM_CUR,
       PREM_AMT,
       STRATEGY,
       MOP_CRTOP,
       MOP_CRTTD,
       EX_ET,
       ORIGIN_CONTRACT,
       STATUS,
       VAL_STATUS,
       TWD_FLAG,
       CNY_FLAG,
       CBC_AMT,
       CBC_AMT_USD_RT,
       DATA_TYPE,
       M_CMP_TYPOID,
       COUNTERPARTY_FULL_NAME,
       I_DT,
       I_M_TP_ENTITY,
       I_RPT_TRADE_D_FLAG,
       I_RPT_TRADE_M_FLAG,
       M_NB,
       M_TP_PFOLIO,
       M_REF_DATA,
       M_CRT_BND12,
       M_CMP_TYPO,
       M_TP_TYPO,
       SYSTEM_DATE
  from V_AC_CU_EXPIRE_REP 
 WHERE  I_DT @I_DT:D
and SUBSTR(I_M_TP_ENTITY,1,7) @I_ENTITY:C
   and DECODE(@I_FREQUENCY:C,'DAILY', I_RPT_TRADE_D_FLAG,'MONTHLY', I_RPT_TRADE_M_FLAG) = 'Y'
   and (( @I_FREQUENCY:C like '%DAILY%')
      or ( @I_FREQUENCY:C like '%MONTHLY%'    ))