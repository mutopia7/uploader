import { Router } from "express";
const router = Router();

router.use((req,res,next) => {
    res.locals.user = {};
    next()
})

router.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

export default router;