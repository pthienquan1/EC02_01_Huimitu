    function APIfeatures(query, queryString){
    this.query = query; // Products.find()
    this.queryString = queryString; // req.query
  
    this.paginating = () => {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 7;
      const skip = limit * (page - 1)
      this.query = this.query.limit(limit).skip(skip)
      return this;
    }
  
    //this.query = Products.find().limit(limit).skip(skip)
  
    this.sorting = () => {
      const sort = this.queryString.sort || '-price';
      this.query = this.query.sort(sort)
      return this;
    }
  
    //this.query = Products.find().limit(limit).skip(skip).sort(sort)
  
    this.searching = () => {
      const search = this.queryString.search;
      if(search){
        this.query = this.query.find({
          $text: { $search: search }
        })
        //console.log(this.query);
      }else{
        this.query = this.query.find()
      }
      return this;
    }
    //this.query = Products.find().find({
    //     $text: { $search: search }
    //  }).limit(limit).skip(skip).sort(sort)
  
    this.filtering = () => {
      const queryObj = { ...this.queryString }
      console.log(queryObj);
      //   //console.log(queryObj);
      // const excludedFields = ['page', 'sort', 'limit', 'search']
      // excludedFields.forEach(el => delete(queryObj[el]))
      
      // let queryStr = JSON.stringify(queryObj);
      // queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g,  (match) => '$' + match);
      // console.log(queryStr)
      const FilteringKeys = Object.keys(queryObj).filter(value=>value.startsWith("filtering_")).map(value => value.split('_')[1]);
      let query = {};
      FilteringKeys.forEach(key => {
        const key1 = `filtering_${key}`;
        let values;
        if(Array.isArray(queryObj[key1]))
        {
          values = [...queryObj[key1]];
        }
        else{
          values = queryObj[key1];
        }
        query[key] = values;
      });
      console.log(query);
      this.query = this.query.find(query).exec();

      return this;
    }
  
    //this.query = Products.find().find({
    //     {"price":{"$gt":"56.99"}}
    //  }).limit(limit).skip(skip).sort(sort)
  }

  module.exports = { APIfeatures };