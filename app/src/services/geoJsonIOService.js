const logger = require('logger');
const ErrorCreatingGist = require('errors/errorCreatingGist');
const GitHubApi = require('@octokit/rest');

const github = new GitHubApi({
    version: '3.0.0',
    protocol: 'https'
});
const MAX_URL_LEN = 150e3;

class GeoJsonIOService {

    static* view(geojson) {

        // if this is a multipolygon, grab the first feature in the collection
        // and ditch the rest-- only need type and coordinates properties
        if (geojson.features[0].geometry.type === 'MultiPolygon') {
            logger.debug('found multipolygon');
            geojson = {
                type: 'MultiPolygon',
                coordinates: geojson.features[0].geometry.coordinates
            };
        } else {

            for (let i = 0; i < geojson.features.length; i++) {
                // doesn't register when set to {} for some reason
                geojson.features[i].properties = null;
            }
        }

        if (JSON.stringify(geojson).length <= MAX_URL_LEN) {
            return `http://geojson.io/` + `#data=data:application/json,${encodeURIComponent(
                JSON.stringify(geojson)
            )}`;

        }
        logger.debug('saving to github gist');
        const res = yield github.gists.create({
            description: '',
            public: true,
            files: {
                'map.geojson': {
                    content: JSON.stringify(geojson)
                }
            }
        });
        if (res.data.html_url) {
            return res.data.html_url;
        }
        throw new ErrorCreatingGist(`Error creating gist`);

    }

}


module.exports = GeoJsonIOService;
