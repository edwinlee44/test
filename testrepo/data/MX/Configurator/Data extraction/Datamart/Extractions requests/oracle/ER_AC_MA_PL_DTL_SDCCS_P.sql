SELECT
PackageNo,
PORTFOLIO,
ENTITY,
BU_CD,
PL_LOCALE,
PL_LOCALE_TODAY
FROM V_AC_MA_PL_DTL_SDCCS_P_REP
WHERE ENTITY@I_ENTITY:C
AND BU_CD@I_BU:C