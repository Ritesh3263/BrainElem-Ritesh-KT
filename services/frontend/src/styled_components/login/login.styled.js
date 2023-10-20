import { new_theme } from "NewMuiTheme";

const HeaderStyle = {
    containerFluid: {
        borderTop: `4px solid ${new_theme.palette.primary.MedPurple}`,
        width: "96%"
    },
    headerSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "5px",
        position: "relative"
    },
    logoImg: {
        width: "120px"
    },
    rightIconImg: {
        width: "60px",
        zIndex: "-9",
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
    login_form_MuiTextField_root: {
        width: "100%"
    },
    login_form_input_form_control: {
        border: `1px solid ${new_theme.palette.shades.black80}`,
        borderRadius: "10px",
        marginTop: "20px",
        fontSize: "16px",
        fontWeight: "600",
        color: new_theme.palette.shades.black40,
        background: new_theme.palette.newSupplementary.SupCloudy,
        fontFamily: "'Nunito', sans-serif",
        "&::placeholder": {
            color: new_theme.palette.shades.black40,
            fontFamily: "'Nunito', sans-serif"
        }
    },
    problam: {
        marginTop: "20px"
    },
    problam_p: {
        fontSize: "16px",
        color: "black",
        fontWeight: "400",
        marginBottom: 0,
        fontFamily: "'Nunito', sans-serif"
    },
    problam_p_button: {
        color: `${new_theme.palette.primary.MedPurple} !important`,
        fontWeight: "700 !important",
        background: "transparent",
        border: "none",
    },
    agree: {
        marginTop: "10px"
    },
    agree_p: {
        fontSize: "12px",
        fontWeight: "400",
        color: "black",
        marginBottom: "0",
        fontFamily: "'Nunito', sans-serif"
    },
    agree_p_a: {
        color: `${new_theme.palette.primary.PVoilet} !important`,
        fontWeight: "700 !important",
    },
    account: {
        marginTop: "5px",
    },
    account_p: {
        color: "black",
        fontSize: "16px",
        fontWeight: "400",
        textAlign: "center",
        fontFamily: "'Nunito', sans-serif",
    },
    account_p_button: {
        color: `${new_theme.palette.primary.MedPurple} !important`,
        fontWeight: "700 !important",
        background: "transparent",
        border: "none",
    },
    footers: {
        borderRadius: "10px",
        background: new_theme.palette.primary.MedPurple,
        textAlign: "center",
        width: "96%",
        paddingTop: "186px",
        paddingBottom: "10px",
        margin: "auto",
        left: "21px",
        position: "absolute",
        bottom: "-40px",
        zIndex: "-1",
    },
    footers_p: {
        fontSize: "14px",
        fontWeight: "400",
        color: "white",
        marginBottom: "0",
        fontFamily: "'Nunito', sans-serif",
    },
    img_blog_img: {
        width: "100%",
    },
    input_password: {
        position: "relative",
    },
    img_hide_icon: {
        position: "absolute",
        right: "32px",
        width: "29px",
        top: "209px",
    }
}