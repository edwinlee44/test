select *
  from V_AC_FNBALMP2HK_QUERY_REP
 where FPFOLIO = @I_FPFOLIO:C
   and FDATE = @I_FDATE:D
   and FBRH = @I_FBRH:C
   and ACCOUNT_LABEL = @I_ACCOUNT_LABEL:C