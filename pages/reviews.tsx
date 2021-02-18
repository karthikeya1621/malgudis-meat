import { Layout } from '@components/common'
import { useEffect, useState } from 'react'
import 'firebase/firestore'
import {
  FirebaseAppProvider,
    firestore,
  useFirestore,
  useFirestoreDocOnce,
} from 'reactfire'
import { Box, Typography } from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import TextArea from '@components/ui/TextArea'
import { Button } from '@components/ui'
import useCustomer from '@framework/use-customer'
import moment from 'moment'

type Review = {
  title?: string
  text: string
  email: string
  firstname: string
  lastname: string
  rating: number
  reviewed_on: Timestamp | any
  isApproved: boolean
}

type Timestamp = {
  seconds: number
  nanoseconds: number
}

type RatingInfo = {
  aggregate: number
  counts: [number, number, number, number, number]
  numberOfRatings: number
}

export default function Reviews() {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isDisabled, setIsDisabled] = useState(true)
  const { data: customer } = useCustomer()

  const reviewsRef = useFirestore().collection('reviews')
  const ratingInfoRef = useFirestore().collection('extras').doc('ratingInfo')

  const [reviews, setReviews] = useState([] as Review[])
  const [ratingInfo, setRatingInfo] = useState<RatingInfo | null>(null)

  const todayDate = firestore.Timestamp.fromDate(new Date())

  useEffect(() => {
    reviewsRef.onSnapshot((result) => {
      const docs = result.docs.map((doc) => doc.data()) as Review[]
      setReviews(docs)
    })
    ratingInfoRef.onSnapshot((result) => {
      setRatingInfo(result.data() as RatingInfo)
    })
  }, [])

  const submitReview = () => {
    const newComment: Review = {
      firstname: customer?.firstName || '',
      lastname: customer?.lastName || '',
      email: customer?.email || '',
      rating: rating,
      text: comment,
      isApproved: true,
      reviewed_on: todayDate
    }
    reviewsRef.add(newComment).catch(err => console.log(err))
  }

  return (
    <>
      <div className="public-reviews w-full">
        <div className="banner-section mcontainer-sm m-auto grid grid-cols-2 gap-10 py-12">
          <div className="col-span-1 flex flex-col justify-center items-center">
            <h1 className="text-6xl font-extrabold mb-4">
              {ratingInfo?.aggregate}{' '}
              <span className="text-2xl font-bold">/&nbsp;&nbsp;5</span>
            </h1>
            <p>Based on {ratingInfo?.numberOfRatings} reviews</p>
            <div className="overalls grid grid-cols-12 mt-6">
              {ratingInfo?.counts.map((c, i) => (
                <div className="col-span-12 grid grid-cols-12 mb-2">
                  <div className="col-span-4">
                    <span className="label">
                      <Rating
                        style={{ transform: 'scale(-1)' }}
                        size="small"
                        readOnly
                        value={5 - i}
                      />
                    </span>
                  </div>
                  <div className="col-span-8 flex items-center">
                    <div className="bar w-full h-3 relative">
                      <div
                        className="innerbar h-full"
                        style={{
                          width: `${(c / ratingInfo.numberOfRatings) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <div className="writereview">
              <Box component="fieldset" mb={1} borderColor="transparent">
                <Typography className="ml-1" component="legend">
                  Rating
                </Typography>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  size="large"
                  onChange={(event, newValue) => {
                    setRating(newValue as number)
                    if (newValue) {
                      setIsDisabled(false)
                    } else {
                      setIsDisabled(true)
                    }
                  }}
                />
              </Box>
              <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography className="ml-1" component="legend">
                  Comments
                </Typography>
                <TextArea
                  className={'reviewtextarea'}
                  placeholder="Write your review here..."
                  onChange={(value) => {
                    setComment(value)
                  }}
                />
              </Box>
              <Button
                variant="slim"
                className={'reviewbtn'}
                disabled={isDisabled}
                onClick={submitReview}
              >
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full allrevsmain">
        <div className="w-full m-auto" style={{ maxWidth: '720px' }}>
          <div className="alrevs w-full py-6">
            {reviews.map((review, ind) => (
              <div className="arev grid grid-cols-12 gap-4 py-6 px-2 border-b">
                <div className="col-span-10 font-bold text-gray-500">
                  {review.firstname} {review.lastname}
                </div>
                <div className="col-span-2 px-1 text-sm">
                  {moment(review.reviewed_on.seconds * 1000).format('ll')}
                </div>
                <div className="col-span-10 text-lg comment">{review.text}</div>
                <div className="col-span-2">
                  <Rating size="small" readOnly value={review.rating} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

Reviews.Layout = Layout
