import express from 'express'
import { getTagCountMap } from '../models/application'

const router: express.Router = express.Router()

/**
 * Defines a GET route handler for retrieving tags and their associated question counts
 * 
 * @param {express.Request} req The incoming HTTP request object
 * @param {express.Response} res The outgoing HTTP response object
 * @returns {void}
 */
router.get('/getTagsWithQuestionNumber', async (req, res) => {
    
    // gets tagCountMap, then converst map to array of objects with tag name and qcount
    getTagCountMap()
      .then(tagCountMapResult => {
        if (!tagCountMapResult) {
          return res.status(500).json({ error: 'Error finding tags' });
        }
  
        const tagCountMap = tagCountMapResult as Map<string, number>;
  
        const tagsWithCount = Array.from(tagCountMap.entries()).map(([name, count]) => ({
          name,
          qcnt: count
        }));
  
        res.json(tagsWithCount);
      })
      .catch(() => {
        res.status(500).json({ error: 'Internal server error' });
      });
  });
export default router
