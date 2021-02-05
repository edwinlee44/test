select *
  from V_DM_AC_MA_PL_DTL_QUERY_REP
 where M_TP_PFOLIO = @I_M_TP_PFOLIO:C
   and M_INSTRUMENT = @I_M_INSTRUMENT:C
   and M_NB = @I_M_NB:N
   and M_TP_ENTITY = @I_M_TP_ENTITY:C
   and DATA_TYPE = @I_DATA_TYPE:C
   and M_TP_PFOLIO@MxPortfolio:C