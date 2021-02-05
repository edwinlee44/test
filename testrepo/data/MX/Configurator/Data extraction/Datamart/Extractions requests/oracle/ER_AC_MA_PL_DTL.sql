SELECT  *
  FROM    V_AC_MA_PL_DTL_REP   TP
where TRN_BU_CD @I_BU:C
   and DATA_DT @I_DT:D 
