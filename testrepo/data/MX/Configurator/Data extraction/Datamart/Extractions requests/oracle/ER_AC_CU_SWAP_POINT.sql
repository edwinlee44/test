SELECT  
M_CRT_BND12,
M_TP_ENTITY,
M_TP_TYPO,
M_CONTRACT,
M_NB,
INTER_EXTER,
M_CMP_TYPOID,
EX_ET,
FAR_NEAR,
M_CNT_ORG,
M_TP_STATUS2,
M_TP_PFOLIO,
TRN_TRADE_DT,
TRN_EXPIRE_DT,
TRN_BS_FLAG,
CNT_AMT_CCY,
CNT_AMT,
CNT_CNTRP_RT,
CNT_CNTRP_AMT_CCY,
CNT_CNTRP_AMT,
M_SPOT_BS_CU,
M_SPOT_BS_NO,
M_SPOT_UD_CU,
M_SPOT_UD_NO,
--M_PL_BS_NO,
PL_BS, --20200602 ADJ
PL_UN, --20200602 ADD
UDF_CHECK,
MODIFY_DT
  FROM    V_AC_CU_SWAP_POINT_REP
where M_TP_ENTITY @I_ENTITY:C
   and M_CRT_BND12 @I_DT:D
