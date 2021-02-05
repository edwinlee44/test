SELECT  *
  FROM    v_ac_ma_pl_ac_rep   TP
where ENTITY @I_ENTITY:C
   and RPT_DT @I_DT:D
   and PL_TYPE @I_TYPE:C
   and BU @I_BU:C
