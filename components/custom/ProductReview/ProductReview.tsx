import { Button } from '@components/ui'
import TextArea from '@components/ui/TextArea'
import { Box, Typography } from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import useReviews, { ProductReviewProps } from 'hooks/useReviews'
import cn from 'classnames'
import { useEffect, useState } from 'react'
import s from './ProductReview.module.scss'
import moment from 'moment-timezone'
import axios from 'axios'

const ProductReview = ({ reviews, productId }: { reviews: ProductReviewProps[], productId: number }) => {
  useEffect(() => {
    console.log(reviews)
  }, [reviews])

  return (
    <div className={s.root}>
      <h2 className={s.reviewheading}>Write a Review</h2>
      <WriteReview productId={productId} />
      <div className={cn(s.allreviews, { hidden: !reviews.length })}>
        <h2 className={s.reviewheading}>All Reviews</h2>
        {reviews?.map((r, id) => (
          <ProductReviewItem key={`rev-${r.id}`} data={r} />
        ))}
      </div>
    </div>
  )
}

export default ProductReview

const WriteReview = ({productId} : {productId: number}) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isDisabled, setIsDisabled] = useState(true)

  const submitReview = async () => {
    if (!isDisabled) {
      const usDate = moment().tz('America/Regina')
      const data = {
        date_reviewed: usDate.format(),
        email: 'paul.chakka@kalinformatics.com',
        name: 'Paul Isac',
        rating,
        title: 'Comment from Paul',
        text: comment+'',
        productId: productId,
        status: 'approved'
      }
      const result = await axios.post('/api/reviews', {...data})
    }
  }

  return (
    <div className={s.writereview}>
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
          className={s.reviewtextarea}
          placeholder="Write your review here..."
          onChange={(value) => {
            setComment(value)
          }}
        />
      </Box>
      <Button
        variant="slim"
        className={s.reviewbtn}
        disabled={isDisabled}
        onClick={submitReview}
      >
        Submit Review
      </Button>
    </div>
  )
}

const ProductReviewItem = ({ data }: { data: ProductReviewProps }) => {
  return (
    <div className={s.reviewitem}>
      <div>
        <span className={s.rfullname}>{data.name}</span>
        <span className={s.rdate}>
          {moment(data.date_created).format('DD MMM, YYYY')}
        </span>
      </div>
      <Rating value={data.rating} size="small" readOnly />
      <p className={s.rcomment}>{data.text}</p>
    </div>
  )
}
