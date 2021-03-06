SELECT 
REPORT_DATE,
LEGAL_ENTITY, 
PORTFOLIO,
FUBON_BLOCK,
PRODUCT_TYPE, 
TRN_TYPE,
TYPOLOGY,
INSTRUMENT,
INSTRUMENT_NM,
TRN_NB,
MARKET_CODE,
SETTLE_QUO,
STATUS,
TRADE_DATE,
MATURITY_DATE,
BUY_SELL,
CALL_PUT,
STRIKE,
CNT_SIZE,
CONTRACT_QTY,
CONTRACT_CCY,
CONTRACT_AMT,
PREMIUM_CCY,
PREMIUM_AMT,
MTM_CCY,
MTM,
MTM2_CCY,
PREMIUM_PL,
CL_PRICE,
UNDERLYING
FROM V_AC_EQ_LST_OS_TRN_REP
WHERE I_M_TP_ENTITY @I_ENTITY:C
      AND I_DT @I_DT:D