SELECT DATA_DT,
       DATA_TYPE,
       M_NB,
       M_TP_PFOLIO,
       M_REF_DATA,
       MKTOP_NB_CRT,
       MKTOP_NB_ORG,
       MKTOP_TYPE_CRT,
       MKTOP_TYPE_LST,
       POSITION_AMT,
       POSITION_AMT_CCY,
       TRN_BU_CD,
       TRN_PRODUCT,
       TRN_STATUS,
       M_CMP_TYPO,
       M_CMP_TYPOID,
       M_CONTRACT,
       M_CRT_BND12,
       M_G2K_NB,
       M_INSTRUMENT,
       M_ORIG_DEAL,
       M_PACKAGE,
       M_QTY_INDEX,
       M_TP_ACCSCT,
       M_TP_BUY,
       M_TP_CREATOR,
       M_TP_ENTITY,
       M_TP_INT,
       M_TP_STRTGY,
       M_TP_TYPE,
       M_TP_TYPO,
       M_TP_VALSTAT,
       M_TRN_FMLY,
       M_TRN_GRP,
       M_TRN_TYPE,
       DATA_COMMENT,
       MODIFY_DT,
       MODIFY_PROC,
       M_MOP_CRTOP,
       M_MOP_CRTTD
  from V_ERQ_AC_MA_POSITION_DTL_REP
 where I_DT = @I_DT:D
   and I_M_TP_PFOLIO = @I_M_TP_PFOLIO:C
   and I_M_INSTRUMENT = @I_M_INSTRUMENT:C
   and I_M_TP_ENTITY = @I_M_TP_ENTITY:C
   and I_DATA_TYPE = @I_DATA_TYPE:C
   and I_M_TP_PFOLIO@MXPORTFOLIO:C
   and I_M_NB = @I_M_NB:N
   and I_M_TP_TYPO= @I_M_TP_TYPO:C