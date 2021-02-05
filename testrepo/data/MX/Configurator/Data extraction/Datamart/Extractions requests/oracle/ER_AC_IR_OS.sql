SELECT  
DATA_DT,
ENTITY,
CREATOR,
ORIG_CNT_NO,
CNT_NO,
TRN_NB,
PORTFOLIO,
BU,
PROD,
M_CMP_TYPO,
TYPO,
STRATEGY,
SECTION,
TRN_STATUS,
STP_STATUS,
B_S,
C_P,
TRADE_DATE,
MARKET_CD,
INSTRUMENT,
M_TP_DTELBL,
EXPIRE_DATE,
STRIKE_PRICE,
LIVE_QUANTITY,
INTERNAL_FLAG,
AMORT_FLAG,
MAIN_TRADE_FLAG,
INIT_END,
MTM_CCY,
MTM,
INTEREST_AMOUNT,
CCS_MTM_SETTLE,
CCS_MTM_UNSETTLE,
PREMIUM_CUR,
PREMIUM_AMOUNT,
PAY_AMOUNT,
PAY_CURR,
PAY_ACCR_INTEREST,
PAY_RATE,
PAY_RATE_TYPE,
PAY_INDEX,
PAY_NEXT_FIX_DATE,
PAY_LAST_FIX_DATE,
PAY_NEXT_REV_DATE,
PAY_LAST_REV_DATE,
REC_AMOUNT,
REC_CURR,
REC_ACCR_INTEREST,
REC_RATE,
REC_RATE_TYPE,
REC_INDEX,
REC_NEXT_FIX_DATE,
REC_LAST_FIX_DATE,
REC_NEXT_REV_DATE,
REC_LAST_REV_DATE,
RANGE,
CNTRP_NAME,
CNTRP_CODE,
BANK,
CNTRP_LOCALE,
CNTRP_HOME_COUNTRY,
OSWP_MATURITY_DT,
FUT_FINAL_PRICE_STRIKE,
FUT_NOM_AMT,
FUT_NOM_AMT_CCY,
RPT_GENERATION_DT,
LINK_NO,
PACKAGE_NO,
VAL_STATUS,
PAYOUT,
CPINDUSTRY,
INITEX,
FIN_EX,
MK_OP,
UDF,
CBC_AMT_USD_RT,
CBC_AMT_USD
  FROM    V_AC_IR_OS_REP TP
where ENTITY @I_ENTITY:C
   and DATA_DT @I_DT:D