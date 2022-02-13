# Getting started

This is a template basis for NFT Web3 integrated websites. Here I am going to show you how to get started and how to set up the development environment.

## Step 1: Clone this repository

Run the following commands in the repository where you want your project in order to clone the repository and switch into the feature branch.
```
git clone https://gitlab.com/hupfmedia/blockchain-frontend-template/
cd blockchain-frontend-template
git checkout feature
```
From now on it will be assumed that you are in the ``blockchain-frontend-template`` directory.

## Step 2: Adjust the project info

Go into package.json and adjust the following lines to your desire:
```
"name": "next-nft-template",
"private": true
```

Hint: as ``name`` only lower case characters and no spaces are allowed.

## Step 3: Install the necessary packages

If you haven't already please download and install the yarn package manager from here: https://yarnpkg.com/getting-started/install

If you are installing yarn with a linux package manager like apt-get, you might run into the issue, that the package manager installs ``cmdtest`` instead. In this case, there is a helpful hint on how to install it manually instead here: https://github.com/Joystream/helpdesk/issues/16#issuecomment-484966596

next we install the local node modules.

```
yarn install
```

Now we are ready for development.

## Step 4: Setup the development environment

``` 
yarn dev
```

The development server is now up on ``localhost:3000``.

## Step 5: Deploying your project

It is recommended to stop the development server while building. Otherwise it may happen that the development server crashes or outputs weird errors.

To stop the development server just run ``CONTROL + C`` in the terminal window.

To build the project run:

```
yarn build
yarn export
```

The finished build is now available in the ``out`` folder of your repository. Just copy it to any webserver.

### Info:
After ``yarn build`` the finished build is in the .next folder of your project. If you want to deploy to other platforms like vercel (see deploy on vercel section), which comes with it's own distribution network, then you can just use these files. If you want to run the page on a normal web server you have to do ``yarn export`` to get the html files.

## Helpful stuff

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.
The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
