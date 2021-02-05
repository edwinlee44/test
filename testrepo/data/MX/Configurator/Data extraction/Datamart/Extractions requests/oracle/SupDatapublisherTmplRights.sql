select 
GRP.M_LABEL as GROUP_LABEL,
A.M_NAME as TEMPLATE_LABEL, 
case B.M_ACTIVE when 1 then 'X' when 0 then '' end as ACTIVE, 
B.M_TYPE as TYPE, 
B.M_ACT_NAME as ACTION, 
B.M_ACT_SUB as SUB_ACTION,  
B.M_RULE as RULE_LABEL
from TRN_GRPD_DBF GRP left outer join DAP_CFGT_DBF A on A.M_NAME = GRP.M_DAP_TMPL left outer join DAP_CFG_DBF B on A.M_NAME = B.M_TEMPLATE left outer join DAP#DAP_RULH_DBF D on D.M_NAME = B.M_RULE 
where GRP.M_LABEL = @GroupLabel:C
order by GROUP_LABEL, TYPE, ACTION