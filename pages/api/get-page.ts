import faunadb from "faunadb";
import uid from "uid-promise";

import { client } from "../../lib/db";

const { Get, Match, Index } = faunadb.query;

export default async (req, res) => {
  let {
    query: { page },
    cookies: { token, linkToken }
  } = req;
  console.log(page)
  if (page === "www") {
    res.status(200).json({ html: null });
    return;
  }
  if (!page) {
    res.status(400).json({ message: "Bad Request: provide a page to query" });
    return;
  }
  let obj = {
    headers: new Headers({'Authorization': 'Basic 1d134410b4ab9802daf227c690d70d035853587e517d976a3f270ebfb853'})
  }
  const resp = await fetch('https://api.naweby.com.br/ecommerce/'+page, obj)
  return resp
  // const data = await resp.json()
  // console.log(data)

  //
  // let sessionId;
  //
  // if (linkToken) {
  //   sessionId = linkToken;
  //   res.setHeader("Set-Cookie", `token=${linkToken}`);
  // } else if (token && !linkToken) {
  //   sessionId = token;
  //   res.setHeader("Set-Cookie", `token=${token}`);
  // } else {
  //   try {
  //     sessionId = await uid(10);
  //     token = sessionId;
  //     res.setHeader("Set-Cookie", `token=${token}`);
  //   } catch (e) {
  //     console.error({ stack: e.stack, message: e.message });
  //     res.status(500).json({ stack: e.stack, message: e.message });
  //     return;
  //   }
  // }
  //
  // try {
  //   let {
  //     data: { sessionId: savedPageSessionId, html }
  //   } = (await client.query(Get(Match(Index("ref_by_name"), page)))) as any;
  //
  //   if (savedPageSessionId === sessionId) {
  //     res.status(200).json({ html, allowEdit: true, token });
  //     return;
  //   } else {
  //     res.status(200).json({ html, allowEdit: false, token });
  //     return;
  //   }
  // } catch (error) {
  //   if (error.name === "NotFound") {
  //     res.status(404).json({ html: null, token });
  //     return;
  //   }
  //
  //   if (error.syscall === "getaddrinfo") {
  //     res.status(500).json({
  //       stack: error.stack,
  //       message:
  //         "There was a network error, please check connection and try again"
  //     });
  //     return;
  //   } else {
  //     console.error({ error });
  //     res.status(500).json({ stack: error.stack, message: error.message });
  //     return;
  //   }
  // }
};
