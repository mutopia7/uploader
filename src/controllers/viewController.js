function indexRender(req, res) {
    res.render("index", { title: "Home"})
}


function signUpRender(req, res) {
    res.render("layouts/sign-up", { title: "Sign Up", errors: {}, oldInput: {}, user: req.user })
}

function loginRender(req, res) {
    res.render("layouts/log-in", { title: "Log In"})
}

export default {
    indexRender,
    signUpRender,
    loginRender
}