SELECT  
M_TP_PFOLIO,
M_TP_NBLTI,
M_TP_NOMINAL,
M_REF_DATA,
M_NB,
M_TP_BS,
M_SCT_NC_BC,
M_SCT_NC_USD,
M_TP_CP,
BSCALLPUT,
M_TP_DTEEXP,
M_TP_DTETRN,
M_TP_STATUS1,
M_TP_STATUS2,
M_TRN_GRP,
M_S_DELTA2,
M_TP_NOMCUR,
M_INSTRUMENT,
M_TP_FXBASE,
M_TP_QTYEQ,
AMT,
M_CRT_BND12,
DELTA_AMT,
DELTA_USD,
NF_PL_USD,
M_TP_IPAYCUR
  FROM  V_AC_CU_OPT_CBC_DELTA_REP
where  M_CRT_BND12 @I_DT:D
