import { new_theme } from "NewMuiTheme";

const HeaderStyle = {
    containerFluid: {
        borderTop: `4px solid ${new_theme.palette.primary.MedPurple}`,
        marginTop: "27px",
    },
    headerSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "5px",
        position: "relative",
        overflow: "hidden"
    },
    logoImg: {
        width: "120px"
    },
    rightIconImg: {
        width: "60px",
        zIndex: "1",
        position: "absolute",
        right: "1px",
        top: "4px"
    },
    CenterName: {
        color: new_theme.palette.primary.MedPurple,
        fontSize: "40px",
        fontWeight: "700",
        textAlign: "center",
        fontFamily: "'Nunito', sans-serif"
    },
    login_inner: {
        background: "white",
        borderRadius: "10px",
        marginTop: "18px",
        padding: "20px 132px 0 132px !important"
    },
    container: {
        maxWidth: "1200px",
        paddingLeft: "0",
        paddingRight: "0"
    },
    hello_blog: {
        background: new_theme.palette.newSupplementary.SupCloudy,
        borderRadius: "100%",
        textAlign: "center",
        height: "500px",
        padding: "10px 50px 50px 50px"
    },
    hello_blog_h2: {
        fontSize: "35px",
        color: new_theme.palette.primary.PVoilet,
        fontWeight: "700",
        fontFamily: "'Nunito', sans-serif"
    },
    hello_blog_p: {
        fontSize: "18px",
        fontWeight: "400",
        color: "black",
        fontFamily: "'Nunito', sans-serif"
    },
    loginContainer: {
        backgroundColor: new_theme.palette.primary.PWhite,
        mixBlendMode: "normal",
        borderRadius: "10px",
        paddingTop: "44px",
        marginBottom: "50px",
        position: "relative",
        zIndex: "1",
    },
    WelcomeItem: {
        boxShadow: `0px 0px 4px ${new_theme.palette.shades.back001}`,
        borderRadius: "10px",
        padding: "33px 30px",
        cursor: "pointer",
        position: "relative",
        marginBottom: "50px",
    },
    WelcomeItemImage: {
        background: new_theme.palette.primary.PWhite,
        borderRadius: "10px",
        padding: "10px"
    },
    welcomeTitle: {
        color: new_theme.palette.primary.PWhite,
        fontWeight: "700",
        fontSize: "48px",
        margin: "18px 0",
        fontFamily: "'Nunito', san-serif",
        textAlign: "center"
    },
    FooterText: {
        fontWeight: "400",
        fontSize: "14px",
        textAlign: "center",
    }
}

export default HeaderStyle