// import styled from '@emotion/styled';

// export const ProfileGrid = styled.div(({ theme: { breakpoints } }) => ({
//   display: 'grid',

//   gridTemplateColumns: 'auto',

//   /* This is better for small screens, once min() is better supported:
//    * grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr));
//    */
//   rowGap: '20px',
//   columnGap: '20px',

//   padding: '30px',

//   // Centering grid items for mobile view requires justifyContent
//   justifyContent: 'center',

//   [breakpoints.laptop]: {
//     // Centering grid items for desktop view requires justifyItems
//     justifyItems: 'center',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//   },
// }));

// export const ProfileWrapper = styled.div({
//   display: 'flex',
//   flexDirection: 'column',
// });

// export const ProfileImageWrapper = styled.div<{
//   height?: string | number;
//   width?: string | number;
// }>(({ height, width, theme: { boxShadows } }) => ({
//   height,
//   width,
//   boxShadow: boxShadows.normal,
//   borderRadius: '6px',
//   backgroundColor: 'white',
// }));
export {};
