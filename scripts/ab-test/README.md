## Manage AB Test configurations
AB Test rollouts to our Fastly CDN account can now be managed via a JSON configuration and executing a script. The new process will read the contents of the JSON configuration, generate the [VCL](https://docs.fastly.com/vcl/) script and then create a new branch in the [Varnish](https://github.com/businessinsider/varnish) repo with the new VCL script. (Currently still investigating the ability to create a PR into Varnish)  Once the branch is pushed to Varnish origin, a PR will have to be created, and then the normal `atlantis apply` logic will have to be followed in order to deploy the new configuration.

#### Pre-requisites
---------
Make sure that you have cloned the Varnish repo to your local machine

```
https://github.com/businessinsider/varnish
```

In order for the script to run, you will need to add a config file to the ab-test script folder.

```
scripts/ab-test/config.js

module.exports = {
  branchPrefix: 'jferrara',             // This is used to create the branch name in the Varnish repo, avoid spaces and special characters
  basePathFenrir: '~/Sites/fenrir',     // The file path on your machine to Fenrir
  basePathVarnish: '~/Sites/varnish',   // The file path on your machine to Varnish
};
```

The script requires a properly structured list of AB Tests

```
scripts/ab-test/tests.js

{
  site: [  
    {
      id: <String> | required,  // This must exactly match the test name your are checking in your logic
      variant: {
        control: <Number: positive number> | required,
        variant: <Number: positive number>,
        ...
      }
    }
  ]
}
```

---------

##### Process

1. Ensure that you have added required fields to the config file: `fenrir/scripts/ab-test/config.js`
2. Update the list of AB tests here: `fenrir/scripts/ab-test/tests.js`.
3. Commit these changes to `Fenrir`.
4. In Terminal, run 
```
npm run abtest:export
```
5. Check the terminal output to ensure that the process completed without errors.
6. Review the file created in your Varnish branch: `https://github.com/businessinsider/varnish`.
7. Create a PR into Varnish
8. Follow instruction on Varnish to deploy the configuration.


_Example of successful script execution_

![image](https://user-images.githubusercontent.com/14058449/73584457-a099ac00-4466-11ea-8b32-93ad13ad8702.png)