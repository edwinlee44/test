select to_char(t.m_tp_dtetrn, 'yyyy/mm/dd') m_tp_dtetrn, t.m_nb, t.m_tp_pfolio, t.M_TP_TYPO as M_TP_TYPO,       
       t.m_tp_cntrp, t.m_tp_buy, t.m_instrument, to_char(t.M_TP_DTEEXP, 'yyyy/mm/dd') as M_TP_DTEEXP,        
       to_char(t.m_tp_nominal, 'fm9,999,999,990.00') m_tp_nominal, t.m_tp_cmnt0, t.m_tp_trader, t.m_dealowner   from MX_FIR_OFF_PREM_REP t
