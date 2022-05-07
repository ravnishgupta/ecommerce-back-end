const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try{
    const rows =await Tag.findAll({
        include: {
          model: Product,
          //Tag table is connected to Product via product tag table
          //The following attribute list is for attributes  from product tag table.
          through:  {attributes: ['id', 'product_id','tag_id']} ,
          as: 'products'
        }
    });
    res.json(rows);
  }
  catch(error)
  {
    console.log(error);
    res.status(500).json(error);
  }

});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  console.log('Inside here');
  try{
      const rows = await  Tag.findOne({
                 where: {id: req.params.id},
                  include: {
                    model: Product,
                    as: 'products',
                    through : {attributes: ['id', 'product_id','tag_id']}                                                     
                 }
      });

      if(!rows)
      {
        res.status(404).json("Tag not found");
        return;
      }
      res.json(rows);
  }
  catch(error)
  {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try{
    const results = await Tag.create({
      tag_name : req.body.tag_name
    });

    res.json(results);
  }
  catch(error)
  {
    console.log(error);
    res.status(500).json(error);
  }
});

router.put('/:id',async (req, res) => {
  // update a tag's name by its `id` value
  try{
    const result  = await Tag.update(req.body,{
      where: {id: req.params.id}
    });

    if(!result[0])
    {
      res.status(404).json({message: "No Tag found"});
      return;
    }
    res.json(result);
  }
  catch(error)
  {
    console.log(error);
    res.status(500).json(error);
  }
});

router.delete('/:id',async (req, res) => {
  // delete on tag by its `id` value
  try{
    const result = await  Tag.destroy({
      where: {id: req.params.id}
    });

    if(!result)
    {
      res.status(404).json("Tag not found");
      return;
    }
    res.json(result);
  }
  catch(error)
  {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;