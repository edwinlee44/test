select TO_CHAR(T1.M_TP_DTETRN,'YYYYMMDD') as M_TP_DTETRN,
       M_NB as M_NB,
       M_TP_PFOLIO as  M_TP_PFOLIO,
       M_TP_TYPO as M_TP_TYPO,
       M_TP_BUY as BUY_SELL,
       M_TP_CNTRP as M_TP_CNTRP,
       M_INSTRUMENT as M_INSTRUMENT,
       M_TP_DTELBL as M_TP_DTELBL,
       to_char(T1.M_TP_NOMINAL, 'fm9,999,999,990.00') as M_TP_NOMINAL,
       M_TP_CMNT0 as  M_TP_CMNT0,
       M_TP_TRADER as M_TP_TRADER,
       M_DEALOWNER as M_DEALOWNER
  from MX_ALL_OFF_PREM_REP T1
 where SUBSTR(M_TP_PFOLIO,1,4) = 'CYFX'
