SELECT  
DATA_DT,
NOMCUR,
M_TP_INT,
M_PRODUCT,
TDY_FLAG,
M_TP_DTEEXP,
M_TP_DTETRN,
M_TP_BS,
M_BANK,
M_CRT_BND12,
M_TP_NOMINAL_SUM,
M_QTY_INDEX,
E_T,
SPOT_RATE,
M_NUM,
EXT_TYPE,
NB,
LINK_NB,
CCS_EX_I,
CCS_EX_F,
--M_REF_DATA,
TYPE_PRODUCT,
TYPE_SERIES,
CBC_AMT_USD,
M_TP_TYPO,
CBC_LEG_TYPE,
RPT_CBC_TYPE_1,
RPT_CBC_TYPE_2,
RPT_CBC_TYPE_3,
RPT_CBC_TYPE_4,
RPT_CBC_TYPE_5,
RPT_CBC_TYPE_6,
RPT_CBC_TYPE_7,
RPT_CBC_TYPE_AMT
  FROM    V_AC_MA_CBC_DTL_REP  TP
where  DATA_DT @I_DT:D