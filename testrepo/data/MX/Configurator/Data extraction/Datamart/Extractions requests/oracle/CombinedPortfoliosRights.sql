select 
M_GROUP as GROUP_LABEL, 
M_LABEL as COMBINED_PORTFOLIO, 
M_UNIT as SIMPLE_PORTFOLIO 
from MUB#GRP_COMB_DBF
where M_GROUP=@GroupLabel:C
order by GROUP_LABEL, COMBINED_PORTFOLIO