SELECT  
M_F_VALUE,
M_NB,
M_CRT_BND12,
M_F_CURRENCY,
EN_AMT,
M_F_AMOUNT,
DIFF
  FROM    V_AC_MA_PAYROUND_CHK_HK_REP  TP
where  M_CRT_BND12 @I_DT:D
