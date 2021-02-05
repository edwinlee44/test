select
CORP.M_CA_EX_DAT as M_CA_EX_DAT,
CORP.M_CA_EVT_TY as M_CA_EVT_TY,
CORP.M_CA_CAT as M_CA_CAT,
CORP.M_CA_REC_DA as M_CA_REC_DA,
case when CORP.M_NB_DAYS<0 then '-'
          when (CORP.M_NB_DAYS>=0 and CORP.M_NB_DAYS<10) then ('0' || cast (CORP.M_NB_DAYS as varchar(10)))
          else cast (CORP.M_NB_DAYS as varchar(10))
end
as M_REMAINING,
INV.M_COLLATERA as M_COL_AGR,
INV.M_COLLATER1 as M_COL_TYPO,
case
	when INV.M_POSITIONT like '%Held_InTra%' then 'Held in Transit'
   when INV.M_POSITIONT like '%Pledged_In%' then 'Pledged in Transit'
   else INV.M_POSITIONT
   end  as M_COL_POS ,
SEC.M_SE_GROUP as M_SEC_GRP,
SEC.M_SE_MARKET as M_SEC_MRKT,
INV.M_CLOSING as M_SEC_QTY,
INV.M_SECISIN as M_SEC_ISIN,
INV.M_INSTRUMEN as M_SEC_INSTR

from COL_CORP_ACT_FB_REP CORP
join COL_INVENTORY_FB_REP				  INV on (INV.M_SECISIN = CORP.M_UND_ISIN and  INV.M_REF_DATA=CORP.M_REF_DATA)
left join COL_SEC_FB_REP 	  SEC on (INV.M_SECLABEL = SEC.M_SE_LABEL and  INV.M_REF_DATA=SEC.M_REF_DATA)
where
CORP.M_REF_DATA=@MxDataSetKey:N