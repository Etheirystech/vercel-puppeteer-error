// File path: src/app/api/generate-image/route.ts

import puppeteer from "puppeteer";
import { NextResponse } from "next/server";

export const maxDuration = 120;
export async function GET() {




    // Launch Puppeteer
    const browser = await puppeteer.launch({headless: "new",
        args: ["--no-sandbox"],});
    const page = await browser.newPage();

    await page.goto(
        "https://www.ultimatetcgcm.com/getCard/character?color=red&attribute=ranged&cost=1&abilityBackground=true&trigger=false&counter=true&foilBorder=false&dropShadow=false&abilityTextSize=16&blackBorder=true&rainbow=false&powerBlack=false&leaderBorderEnabled=true&leaderBorder=standard&cardKindRoute=character",
        { timeout: 240000 },
    );
    // Set the viewport to handle the dimensions of the image
    const abilityTextParagraphParent = (await page.$(
        ".ability-text",
    )) as HTMLDivElement | null;
    const triggerTextParagraphParent = (await page.$(
        ".trigger-text",
    )) as HTMLDivElement | null;

    await page.setViewport({ width: 3357, height: 4692 });
    await page.evaluate(
        async (
            imageDataURI,
            abilityTextParagraphParent,
            cardAbilityText,
            triggerTextParagraphParent,
            triggerText,
        ) => {
            const img: HTMLImageElement | null =
                document.querySelector(".cardScreenshot");
            document.body.style.background = "transparent";
            if (abilityTextParagraphParent) {
                const a = document.createElement("p");
                a.innerHTML = `${cardAbilityText}`;
                await new Promise((resolve) => setTimeout(resolve, 2000));
                abilityTextParagraphParent.appendChild(a);
            }
            if (triggerTextParagraphParent) {
                const a = document.createElement("p");
                a.innerHTML = `${triggerText}`;
                await new Promise((resolve) => setTimeout(resolve, 2000));
                triggerTextParagraphParent.appendChild(a);
            }
            if (img) {
                img.src = imageDataURI;
            }
            /* document.body.appendChild(img);*/
        },
        "",
        abilityTextParagraphParent,
        "",
        triggerTextParagraphParent,
        "",
    );
    await page.waitForSelector("body", { timeout: 240000 });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // Capture a screenshot
    const imageBuffer = await page.screenshot({ omitBackground: true });

    // Close the Puppeteer browser
    await browser.close();

    // Send the image data back to the client
    return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
            "Content-Type": "image/png",
        },
    });
}
type Color =
    | "red"
    | "green"
    | "blue"
    | "yellow"
    | "purple"
    | "black"
    | "blackYellow"
    | "blueBlack"
    | "bluePurple"
    | "blueYellow"
    | "greenBlack"
    | "greenBlue"
    | "greenPurple"
    | "greenYellow"
    | "purpleBlack"
    | "redBlack"
    | "redBlue"
    | "redGreen"
    | "redPurple"
    | "redYellow"
    | "purpleYellow";
type LeaderBorder = "standard" | "black" | "op3 AA" | "op1/2 AA" | "rainbow";
type state ={
    color: Color;
    attribute: string;
    name: string;
    cardType: string;
    cost: string;
    power: string;
    ability: string;
    abilityBackground: boolean;
    trigger: boolean;
    triggerText: string;
    counter: boolean;
    counterText: string;
    set: string;
    rarity: string;
    cardNum: string;
    printWave: string;
    image: string;
    imageFile: File | null;
    imageUrl: string;
    imageError: string;
    artist: string;
    life: string;
    foilBorder: boolean;
    dropShadow: boolean;
    abilityTextSize: number;
    imageFull: boolean;
    blackBorder: boolean;
    ["op1/2 AA"]: boolean;
    ["op3 AA"]: boolean;
    rainbow: boolean;
    powerBlack: boolean;
    leaderBorder: LeaderBorder;
    leaderBorderEnabled: boolean;
    cardKind?: string;
    cardKindRoute?: "character" | "leader" | "event" | "stage" | "don";
    isCropping: boolean;
    helpScreen: boolean;
    editorState: Record<string, any>;
    triggerEditorState: Record<string, any>;
    editorDefaultState: Record<string, any>;
};

// ORIGINAL CODE
/*

import puppeteer from "puppeteer";
import { NextRequest, NextResponse } from "next/server";
import { state } from "@/store/formSlice";
export const maxDuration = 120;
export async function POST(request: NextRequest) {
    const card = (await request.json()) as state;

    const abilityText = card.ability;
    const triggerText = card.triggerText;

    // Launch Puppeteer
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    await page.goto(
        `https://ultimatetcgcm.com/getCard/${card.cardKindRoute}?color=${
            card.color
        }&attribute=${card.attribute}${card.name ? `&name=${card.name}` : ""}${
            card.cardType ? `&cardType=${card.cardType}` : ""
        }&cost=${card.cost}${
            card.power ? `&power=${card.power}` : ""
        }&abilityBackground=${card.abilityBackground}&trigger=${
            card.trigger
        }&counter=${card.counter}${
            card.counterText ? `&counterText=${card.counterText}` : ""
        }${card.set ? `&set=${card.set}` : ""}${
            card.rarity ? `&rarity=${card.rarity}` : ""
        }${card.cardNum ? `&cardNum=${card.cardNum}` : ""}${
            card.printWave ? `&printWave=${card.printWave}` : ""
        }${card.artist ? `&artist=${card.artist}` : ""}${
            card.life ? `&life=${card.life}` : ""
        }&foilBorder=${card.foilBorder}&dropShadow=${
            card.dropShadow
        }&abilityTextSize=${card.abilityTextSize}&blackBorder=${
            card.blackBorder
        }&rainbow=${card.rainbow}&powerBlack=${
            card.powerBlack
        }&leaderBorderEnabled=${card.leaderBorderEnabled}&leaderBorder=${
            card.leaderBorder
        }&cardKindRoute=${card.cardKindRoute}`
            .replaceAll("-", "Don|touch")
            .replaceAll(" ", "-"),
        { timeout: 240000 },
    );
    // Set the viewport to handle the dimensions of the image
    const abilityTextParagraphParent = (await page.$(
        ".ability-text",
    )) as HTMLDivElement | null;
    const triggerTextParagraphParent = (await page.$(
        ".trigger-text",
    )) as HTMLDivElement | null;

    await page.setViewport({ width: 3357, height: 4692 });
    await page.evaluate(
        async (
            imageDataURI,
            abilityTextParagraphParent,
            cardAbilityText,
            triggerTextParagraphParent,
            triggerText,
        ) => {
            const img: HTMLImageElement | null =
                document.querySelector(".cardScreenshot");
            document.body.style.background = "transparent";
            if (abilityTextParagraphParent) {
                const a = document.createElement("p");
                a.innerHTML = `${cardAbilityText}`;
                await new Promise((resolve) => setTimeout(resolve, 2000));
                abilityTextParagraphParent.appendChild(a);
            }
            if (triggerTextParagraphParent) {
                const a = document.createElement("p");
                a.innerHTML = `${triggerText}`;
                await new Promise((resolve) => setTimeout(resolve, 2000));
                triggerTextParagraphParent.appendChild(a);
            }
            if (img) {
                img.src = imageDataURI;
            }
            /!* document.body.appendChild(img);*!/
        },
        card.imageUrl,
        abilityTextParagraphParent,
        abilityText,
        triggerTextParagraphParent,
        triggerText,
    );
    await page.waitForSelector("body", { timeout: 240000 });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // Capture a screenshot
    const imageBuffer = await page.screenshot({ omitBackground: true });

    // Close the Puppeteer browser
    await browser.close();

    // Send the image data back to the client
    return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
            "Content-Type": "image/png",
        },
    });
}
*/
