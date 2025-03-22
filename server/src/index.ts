import initApp from "./server";
import https from "https"
import fs from "fs"

initApp().then((app) =>
{
  if(process.env.NODE_ENV!=='production') {
    app.listen(process.env.PORT, () => {
      console.log(
        `Example app listening at http://localhost:${process.env.PORT}`
      );
    })
  } else {
      const prop = {
        key: fs.readFileSync("../../client-key.pem"),
        cert: fs.readFileSync("../../client-cert.pem")
      }

      https.createServer(prop, app).listen(process.env.PORT)
  }
}
);
