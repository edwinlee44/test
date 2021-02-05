select
DATA_DT,
M_TP_ENTITY,
TRN_BU,
TRN_PRODUCT,
M_TP_TYPO,
DATA_TYPE,
M_CMP_TYPO,
M_PAYREC1,
M_PACKAGE,
M_TP_NBLTI,
M_CNT_ORG,
M_CONTRACT,
TRN_NB,
TRN_STATUS,
M_STP_STATUS,
PORTFOLIO,
TRN_TRADE_DT,
TRN_START_DT,
MATURITY_DT,
CNTRP_CD,
CNTRP_NM,
BANK_FLAG,
CNTRP_LOCALE,
CNTRP_HOMECNTRY,
CNTRP_CNTRY_CD,
COLLATERAL_FLAG,
COLLATERAL_CNT,
NOM_AMT_CCY,
NOM_AMT,
INTEREST_RT,
INTEREST_AMT_CCY,
INTEREST_AMT,
MTM_CCY,
MTM,
FIX_DT_LST,
FIX_DT_NXT,
REV_DT_LST,
REV_DT_NXT,
RT_CONV,
RT_INDEX,
STRATEGY,
M_TP_ACCSCT,
DERIVE_PRODUCT_CD,
DERIVE_LINK_NB,
DERIVE_NB,
DERIVE_AMT_CCY,
DERIVE_AMT,
DERIVATE_CHECK,
I_DT,
I_M_TP_ENTITY,
M_NB,
M_TP_PFOLIO,
M_REF_DATA,
M_CRT_BND12,
SYSTEM_DATE
FROM    V_AC_IR_LNBR_OS_TRN_REP TP
where M_TP_ENTITY @I_ENTITY:C
   and DATA_DT @I_DT:D
