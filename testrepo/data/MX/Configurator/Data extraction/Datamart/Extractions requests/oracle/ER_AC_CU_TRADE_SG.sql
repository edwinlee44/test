select DATA_DT,
       ENTITY,
       BU,
       E_I,
       TRN_PRODUCT,
       M_TRN_TYPE,
       TRADE_CATEGORY,
       EVENT,
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
       CONTRACT_AMOUNT2,
       COUNTER_RATE,
       CUR_2,
       COUNTER_AMOUNT,
       COUNTER_AMOUNT_FLEX,
       COUNTER_AMOUNT_FLEX2,
       MULTIPLIER_COMPONENT,
       COUNTERPARTY_CODE,
       COUNTERPARTY_FULL_NAME,
       BANK_CUSTOMER,
       LOCALE,
       HOME_COUNTRY,
       BRANCH_CODE,
       PREM_CUR,
       PREM_AMT,
       STRATEGY,
       DCD_CUR,
       DEPOSIT_AMT,
       MOP_CRTOP,
       MOP_CRTTD,
       EX_ET,
       ORIGIN_CONTRACT,
       STATUS,
       VAL_STATUS,
       BACK_DATE,
       TWD_FLAG,
       CNT_FLAG,
       CBC_AMT,
       CBC_AMT_USD_RT,
       I_DT,
       I_M_TP_ENTITY,
       I_RPT_TRADE_D_FLAG,
       I_RPT_TRADE_M_FLAG,
       M_NB,
       M_TP_PFOLIO,
       M_REF_DATA,
       M_CRT_BND12,
       M_CMP_TYPO,
       M_CMP_TYPOID,
       M_MOP_CRTOP,
       M_TP_TYPO,
       SYSTEM_DATE,
       TRN_FAR_EXPIRE_DT,
       TRN_NEAR_EXPIRE_DT,
       DATA_TYPE,
       TRAN_TYPE,
       M_CCP_CODE
  from V_AC_CU_TRADE_REP TP
 where I_DT @I_DT:D
and I_M_TP_ENTITY @I_ENTITY:C
and DECODE(@I_FREQUENCY:C,'DAILY',I_RPT_TRADE_D_FLAG,'MONTHLY',I_RPT_TRADE_M_FLAG) = 'Y'
   and (( @I_FREQUENCY:C like '%DAILY%')
      or ( @I_FREQUENCY:C like '%MONTHLY%'    ))