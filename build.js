/*
 * Minio Cloud Storage (C) 2016 Minio, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var moment = require('moment')
var async = require('async')
var exec = require('child_process').exec
var fs = require('fs')

var isProduction = process.env.NODE_ENV == 'production' ? true : false
var assetsFileName = ''
var commitId = ''
var date = moment.utc()
var version = date.format('YYYY-MM-DDTHH:mm:ss') + 'Z'
var releaseTag = date.format('YYYY-MM-DDTHH-mm-ss') + 'Z'
var buildType = 'DEVELOPMENT'
if (process.env.MINIO_UI_BUILD) buildType = process.env.MINIO_UI_BUILD

rmDir = function(dirPath) {
  try { var files = fs.readdirSync(dirPath); }
  catch(e) { return; }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        rmDir(filePath);
    }
  fs.rmdirSync(dirPath);
};

async.waterfall([
    function(cb) {
      rmDir('production');
      rmDir('dev');
      var cmd = 'webpack -p --config webpack.production.config.js'
      if (!isProduction) {
        cmd = 'webpack';
      }
      console.log('Running', cmd)
      exec(cmd, cb)
    },
    function(stdout, stderr, cb) {
      if (isProduction) {
        fs.renameSync('production/index_bundle.js',
                      'production/index_bundle-' + releaseTag + '.js')
      } else {
        fs.renameSync('dev/index_bundle.js',
                      'dev/index_bundle-' + releaseTag + '.js')
      }
    },
  ], function(err) {
    if (err) return console.log(err)
  })
