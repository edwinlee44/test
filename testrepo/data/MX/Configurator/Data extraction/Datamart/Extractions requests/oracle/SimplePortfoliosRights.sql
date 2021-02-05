/*
Display Combined portfolio and their level
*/
select
RGT.M_GROUP as GROUP_LABEL,
'Default Rights' as RIGHT_TYPE,  
TREE.M_LABEL as PORTFOLIO_LABEL, 
case RGT.M_ACCESS 
    when 0 then 'Read write' 
	when 1 then 'Read only' 
	when 2 then 'Deny'
	when 4 then 'Write only' 
end as RIGHTS,
M_HEIGHT as TREE_LEVEL,
'Combined' as PORTFOLIO_TYPE
from MUB#MUB_TREE_DBF TREE join MUB#GRP_RGT1_DBF RGT on RGT.M_NODE_REF = TREE.M_REF 
where 
TREE.M_TRE_GROUP='MUB' and 
TREE.M_TRE_NAME='MUB' and 
RGT.M_GROUP=@GroupLabel:C

union all

/*
Display Simple portfolio and their level
*/
select
A.GROUP_LABEL as GROUP_LABEL,
case when (RGT2.M_REF is null) then 'Default Rights' else 'Specific Rights' end as RIGHT_TYPE,
A.M_PTF_LABEL as PORTFOLIO_LABEL, 
A.M_PTF_RGT as RIGHTS,
M_HEIGHT as TREE_LEVEL,
'Simple' as PORTFOLIO_TYPE
from
(
	select PFRG.M_PTF_REF, PFRG.M_PTF_LABEL, 
	case PFRG.M_PTF_RGT 
	when 0 then 'Read write' 
	when 1 then 'Read only' 
	when 2 then 'Deny'
	when 4 then 'Write only' 
	end as M_PTF_RGT, 
    GRPD.M_LABEL as GROUP_LABEL
	from GRP_SPTF_DBF PFRG 
	inner join TRN_GRPD_DBF GRPD on  PFRG.M_GRP_REF = GRPD.M_REFERENCE
	inner join TRN_PFLD_DBF AA on PFRG.M_PTF_REF = AA.M_REF and AA.M_TYPE = 0
) A
left join MUB#GRP_RGT2_DBF RGT2 on (A.M_PTF_LABEL = RGT2.M_PFOLIO and  A.GROUP_LABEL= RGT2.M_GROUP)
join MUB#MUB_TREE_DBF TREE on A.M_PTF_LABEL = TREE.M_LABEL
where GROUP_LABEL=@GroupLabel:C
order by GROUP_LABEL,PORTFOLIO_LABEL

