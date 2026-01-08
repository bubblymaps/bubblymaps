import { NextRequest, NextResponse } from "next/server";
import { Reviews, type ReviewData } from "@/server/review/review";
import { auth } from "@/server/auth";
import { awardXP } from "@/server/xp/exp";

export async function GET(req: NextRequest) {
  try {
    // Get params
    const url = new URL(req.url);
    const userIdParam = url.searchParams.get("userId");
    const bubblerIdParam = url.searchParams.get("bubblerId");

    let reviews;

    // ?userId
    if (userIdParam) {
      reviews = await Reviews.byUser(userIdParam);
    }

    // ?bubblerId
    else if (bubblerIdParam) {
      reviews = await Reviews.byBubbler(Number(bubblerIdParam));
    }

    // If none
    else {

      return NextResponse.json(
        {
          success: false,
          error: "Please query using either userId or bubblerId"
        },
        { status: 400 }
      );

    }

    // Return reviews
    return NextResponse.json(
      {
        success: true,
        reviews
      },
      { status: 200 }
    );

  } catch (err: any) {

    return NextResponse.json(
      {
        success: false,
        error: err.message
      },
      { status: 500 }
    );

  }
}

export async function POST(req: NextRequest) {

  // Check session
  const session = await auth();

  if (!session) {

    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized"
      },
      { status: 401 }
    );

  }

  try {

    const { rating, comment, bubblerId } = await req.json();
    const userId = session.user.id;

    // Validate input
    if (!bubblerId || !rating) {

      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields"
        },
        { status: 400 }
      );

    }

    const reviewData: ReviewData = { bubblerId, rating, comment, userId };
    const newReview = await Reviews.add(reviewData);

    // Award XP
    await awardXP(userId, 'ADD_REVIEW');

    return NextResponse.json(
      {
        success: true,
        review: newReview
      },
      { status: 200 }
    );

  } catch (err: any) {

    return NextResponse.json(
      {
        success: false,
        error: err.message
      },
      { status: 500 }
    );

  }
}

export async function DELETE(req: NextRequest) {

  // Check session / API token
  const session = await auth();
  const userToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const apiToken = process.env.API_TOKEN;
  const hasApiToken = !!apiToken && !!userToken && apiToken === userToken;

  if (!session && !hasApiToken) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized"
      },
      { status: 401 }
    );
  }

  try {
    const reviewId = Number(new URL(req.url).searchParams.get("id"))

    // No review ID
    if (!reviewId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing review ID"
        },
        { status: 400 }
      );
    }

    // Not found
    const review = await Reviews.getId(reviewId)
    if (!review) {
      return NextResponse.json(
        {
          success: false,
          error: "Review not found"
        },
        { status: 404 }
      );
    }

    if (review.userId !== session?.user?.id && !session?.user?.moderator) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden"
        },
        { status: 403 }
      );
    }

    const deletedReview = await Reviews.delete(reviewId)

    return NextResponse.json(
      {
        success: true,
        review: deletedReview
      },
      { status: 200 }
    );

  } catch (err: any) {

    return NextResponse.json(
      {
        success: false,
        error: err.message
      },
      { status: 500 }
    );

  }
}