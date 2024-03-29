/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 31.01.2024 02:50
 */

export const BreakpointsValues = {
    xs: 576,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1400,
    xxl: 1401

};
export const Breakpoints = {
    xs: `@media only screen and (max-width: ${BreakpointsValues.xs}px)`,
    sm: `@media only screen and (max-width: ${BreakpointsValues.sm}px)`,
    md: `@media only screen and  (max-width: ${BreakpointsValues.md}px)`,
    lg: `@media only screen and  (max-width: ${BreakpointsValues.lg}px)`,
    xl: `@media only screen and (max-width:  ${BreakpointsValues.xl}px)`,
    xxl: `@media only screen and (min-width: ${BreakpointsValues.xxl}px)`,
};

// https://getbootstrap.com/docs/5.0/layout/breakpoints/

// X-Small	None	<576px
// Small	sm	≥576px
// Medium	md	≥768px
// Large	lg	≥992px
// Extra large	xl	≥1200px
// Extra extra large	xxl	≥1400px