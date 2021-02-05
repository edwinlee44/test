SELECT  *
  FROM    v_ac_ma_pl_rep   TP
where BU @I_BU:C
   and RPT_DT @I_DT:D 
   and PL_TYPE @I_TYPE:C
