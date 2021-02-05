SELECT
   M_CRT_BND12,
   M_TP_ENTITY,
   TRN_BU,
   M_ORIG_DEALR,
   M_CONTRACT,
   M_MOP_CRTTD,
   M_NB,
   M_CMP_TYPOID,
   MKTOP_TYPE_LST,
   M_TP_CREATOR,
   M_TP_TYPO,
   M_TP_STATUS2,
   M_TP_PFOLIO,
   TRN_TRADE_DT,
   TRN_EXPIRE_DT,
   M_TP_DTESYS,
   TRN_BS_FLAG,
   CNT_AMT_CCY,
   CNT_AMT,
   CNT_CNTRP_AMT_CCY,
   CNT_CNTRP_AMT
  FROM   V_AC_CU_EXET_REP
where M_CRT_BND12 @I_DT:D
and SUBSTR(M_TP_ENTITY,1,7) @I_ENTITY:C