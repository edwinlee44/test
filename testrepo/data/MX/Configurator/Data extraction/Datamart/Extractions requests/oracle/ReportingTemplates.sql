select 
C.M_LABEL as GROUP_LABEL,
'PRINTERS' as CATEGORY, 
A.M_LABEL as TEMPLATE_LABEL, 
A.M_REF as REFERENCE, 
B.M_PRINTLBL as ITEM_LABEL,
null as DESCRIPTION, 
case (B.M_VISIBLE)
when 'T' then 'X' end as VISIBLE_RIGHT, 
null as DELETE_RIGHT,
null as WRITE_RIGHT,
null as CAN_GENERATE_DATA_RIGHT,
case (A.M_RUNDATA) when 'T' then 'X' end as GRANT_DATA_GENERATION_RIGHTS
from TRN_GRPD_DBF C left outer join ACT_RGTTMP_DBF A on A.M_LABEL = C.M_REP_TMPL left outer join ACT_RGTPRT_DBF B on A.M_REF = B.M_REFTEMPL 
where C.M_LABEL=@GroupLabel:C 
union all
select 
C.M_LABEL as GROUP_LABEL,
'DIRECTORIES' as CATEGORY, 
A.M_LABEL as TEMPLATE_LABEL, 
A.M_REF as REFERENCE, 
E.M_LABELDIR as ITEM_LABEL, 
null as DESCRIPTION, 
case (D.M_VISIBLE)
when 'T' then 'X' end as VISIBLE_RIGHT, 
case (D.M_DELETE)
when 'T' then 'X' end as DELETE_RIGHT, 
case (D.M_WRITE)
when 'T' then 'X' end as WRITE_RIGHT,
null as CAN_GENERATE_DATA_RIGHT,
case (A.M_RUNDATA) when 'T' then 'X' end as GRANT_DATA_GENERATION_RIGHTS
from TRN_GRPD_DBF C left outer join ACT_RGTTMP_DBF A on A.M_LABEL = C.M_REP_TMPL left outer join  ACT_RGTDIR_DBF D on A.M_REF = D.M_REFTEMPL left outer join ACT_REFDIR_DBF E on D.M_REFDIR = E.M_REF
where C.M_LABEL=@GroupLabel:C
union all
select 
C.M_LABEL as GROUP_LABEL,
case when M_EXECTX = 5 then 'FEEDERS' 
else case when M_EXECTX = 6 then 'REPORTS'
else case when M_EXECTX = 7 then 'EXTRACTIONS'
else case when M_EXECTX = 8 then 'STORED PROCEDURES'
else case when M_EXECTX < 5 then 'SETS OF LAYOUT'
end end end end end as CATEGORY, 
A.M_LABEL as TEMPLATE_LABEL, 
A.M_REF as REFERENCE, 
G.M_LABEL as ITEM_LABEL, 
G.M_DESC as DESCRIPTION, 
case (F.M_VISIBLE)
when 'T' then 'X' end as VISIBLE_RIGHT,
null as DELETE_RIGHT,
null as WRITE_RIGHT,
case (M_GENDATA)
when 'T' then 'X' end as CAN_GENERATE_DATA_RIGHT,
case (A.M_RUNDATA) when 'T' then 'X' end as GRANT_DATA_GENERATION_RIGHTS
from TRN_GRPD_DBF C left outer join ACT_RGTTMP_DBF A on A.M_LABEL = C.M_REP_TMPL left outer join ACT_RGTBAT_DBF F on A.M_REF = F.M_REFTEMPL left outer join ACT_BAT_DBF G on F.M_REFBATCH = G.M_REF  
where C.M_LABEL=@GroupLabel:C
union all
select 
C.M_LABEL as GROUP_LABEL,
case when G.M_TYPE = 0 then 'BATCHES OF REPORTS' 
else case when G.M_TYPE = 1 then 'BATCHES OF FEEDERS'
else case when G.M_TYPE = 2 then 'BATCHES OF EXTRACTIONS'
else case when G.M_TYPE = 3 then 'BATCHES OF STORED PROCEDURES'
end end end end as TYPE_LABEL, 
A.M_LABEL as TEMPLATE_LABEL, 
A.M_REF as REFERENCE, 
G.M_LABEL as ITEM_LABEL, 
G.M_DESC as DESCRIPTION, 
case (F.M_VISIBLE)
when 'T' then 'X' end as VISIBLE_RIGHT,
null as DELETE_RIGHT,
null as WRITE_RIGHT,
null as CAN_GENERATE_DATA_RIGHT,
case (A.M_RUNDATA) when 'T' then 'X' end as GRANT_DATA_GENERATION_RIGHTS
from TRN_GRPD_DBF C left outer join ACT_RGTTMP_DBF A on A.M_LABEL = C.M_REP_TMPL left outer join ACT_RGTSET_DBF F on A.M_REF = F.M_REFTEMPL left outer join ACT_SET_DBF G on F.M_REFSET = G.M_REF
where C.M_LABEL=@GroupLabel:C
order by GROUP_LABEL, CATEGORY,ITEM_LABEL