import * as express from "express";
import * as firebaseAdmin from "firebase-admin";
import { nanoid } from "nanoid";

export const initialize = () => {
  const router = express.Router();
  const db = firebaseAdmin.firestore(); // it feels inefficient to write firebaseAdmin.firestore everytime

  //GET /users  -  returns all the users in the database
  router.get("/users", async (_req: express.Request, res: express.Response) => {
    try {
      const usersCollectionReference = db.collection("users");
      const usersSnapshot = await usersCollectionReference.get();
      const users = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.status(200).send({ users });
    } catch (error) {
      res.send(error);
    }
  });

  // POST /users -   adds a new user to the database
  router.post("/users", async (req: express.Request, res: express.Response) => {
    try {
      const { firstName, lastName, email } = req.body;

      if (!firstName || !lastName || !email) {
        res.status(400).send({ message: "Missing fields" });

        return;
      }
      await db.collection("users").doc(nanoid()).set({
        firstName,
        lastName,
        email,
      });
      res.status(201).send({ message: "Created a new User", success: true });
    } catch (error) {
      res.send(error);
    }
  });

  // GET /users/:id  - returns a specific user by id
  router.get(
    "/users/:id",
    async (req: express.Request, res: express.Response) => {
      try {
        const { id } = req.params;
        const userDocumentReference = db.collection("users").doc(id);
        const userDocumentSnapshot = await userDocumentReference.get();

        if (!userDocumentSnapshot.exists) {
          res
            .status(404)
            .send({ message: `User with id=${id} does not exist` });

          return;
        }
        const userDocument = {
          id: userDocumentSnapshot.id,
          ...userDocumentSnapshot.data(),
        };
        res.status(200).send({ user: userDocument });
      } catch (error) {
        res.send(error);
      }
    }
  );

  //  PATCH /users/:id - updates a specific user
  router.patch(
    "/users/:id",
    async (req: express.Request, res: express.Response) => {
      try {
        const { id } = req.params;
        const userDocumentReference = db.collection("users").doc(id);
        await userDocumentReference.update({ ...req.body });
        res.status(200).send({ message: "User updated", success: true });
      } catch (error) {
        res.send(error);
      }
    }
  );

  // DELETE /users/:id - deletes a specific user
  router.delete(
    "/users/:id",
    async (req: express.Request, res: express.Response) => {
      try {
        const { id } = req.params;
        const userDocumentReference = db.collection("users").doc(id);
        await userDocumentReference.delete();
        res.status(200).send({ message: "User Deleted", success: true });
      } catch (error) {
        res.send(error);
      }
    }
  );

  return router;
};
