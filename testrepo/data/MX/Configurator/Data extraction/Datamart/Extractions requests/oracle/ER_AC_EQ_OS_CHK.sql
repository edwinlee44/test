SELECT 
      DATA_DT,
       ENTITY,
       CHK_TYPE,
       CHK_SECTION,
       CHK_AMT_CCY,
       CHK_AMT_AC,
       CHK_AMT_TRN,
       CHK_AMT_DIFF
  FROM    V_AC_EQ_OS_CHK_REP TP
where ENTITY @I_ENTITY:C
   and DATA_DT @I_DT:D
