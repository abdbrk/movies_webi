import fs from "node:fs";

const getAllLists = (req, res) => {
  fs.readFile("lists.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500);
    }

    const cleanData = JSON.parse(data);

    res.status(200).json({ lists: cleanData });
  });
};

const getUserAllList = (req, res) => {
  const idOwner = Number(req.params.idOwner);

  if (isNaN(idOwner)) {
    res.status(400).json({
      error: true,
      message: "Cet id n'est pas valide",
    });
  } else {
    fs.readFile("lists.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500);
      }
      const cleanData = JSON.parse(data);
      const listsUser = [];

      for (let i = 0; i < cleanData.length; i++) {
        console.log(idOwner, cleanData[i].idOwner);
        if (idOwner === Number(cleanData[i].idOwner)) {
          listsUser.push(cleanData[i]);
        }
      }

      res.status(200).json({ lists: listsUser });
    });
  }
};

const getListById = (req, res) => {
  const idList = Number(req.params.id);

  if (isNaN(idList)) {
    res.status(400).json({
      error: true,
      message: "Cet id n'est pas valide",
    });
  } else {
    fs.readFile("lists.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(404);
      }
      const cleanData = JSON.parse(data);

      for (let i = 0; i < cleanData.length; i++) {
        if (idList === Number(cleanData[i].id)) {
          res.status(200).json({ lists: cleanData[i] });
        }
      }
    });
  }
};

const createList = (req, res) => {
    fs.readFile("lists.json", "utf8", (err, data) => {
        if (err) {
          console.error(err);
          res.status(404);
        }
    const cleanData = JSON.parse(data);

    const { idOwner, title } = req.body;
    if (!idOwner) {
        res.status(400).json({
            error: true,
            message: "L'idOwner n'est pas renseigné",
        })
    }

    if (!title) {
        res.status(400).json({
            error: true,
            message: "Le titre n'est pas renseigné",
        })
    }

    let newList = {
        "id": cleanData.length + 1,
        "title": title,
        "idOwner": idOwner,
        "idMovies": []
    }
    const newData = [...cleanData, newList]
    console.log(newData)
    fs.writeFile('lists.json', JSON.stringify(newData) , err => {
        if (err) {
          console.error(err);
          res.status(500).json({error: true, message: 'ntm'})
        } else {
          res.status(200).json({
            message: "La liste a bien été ajoutée"
          })
        }
      });
    })
};

export { getAllLists, getUserAllList, getListById, createList };
